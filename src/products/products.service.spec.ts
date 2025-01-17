import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: any;

  const mockProductModel = {
    find: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
    findByIdAndUpdate: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all products with filters', async () => {
    const result = await service.findAll(1, 5, {
      name: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    expect(model.find).toHaveBeenCalled();
    expect(model.where).toHaveBeenCalledTimes(0);
    expect(model.skip).toHaveBeenCalledWith(0);
    expect(model.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual([]);
  });

  it('should delete a product', async () => {
    const result = await service.deleteProduct('1');
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { deleted: true },
      { new: true },
    );
    expect(result).toEqual({ deleted: true });
  });
});
