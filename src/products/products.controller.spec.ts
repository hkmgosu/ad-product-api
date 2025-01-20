import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { BadRequestException } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockProductsService = {
    findAll: jest.fn().mockResolvedValue([]),
    deleteProduct: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of products', async () => {
    const page = 1;
    const limit = 5;
    const filter = {
      name: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    };
    const result = await controller.findAll({
      page,
      limit,
      ...filter,
    });

    expect(result).toEqual([]);
    expect(mockProductsService.findAll).toHaveBeenCalledWith(
      page,
      limit,
      filter,
    );
  });

  it('should throw BadRequestException if limit > 5', async () => {
    await expect(
      controller.findAll({
        page: 1,
        limit: 6,
        name: 'Apple',
        category: 'Smartwatch',
        minPrice: 1400,
        maxPrice: 1800,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete a product by id', async () => {
    const result = await controller.remove({ id: '1' });
    expect(result).toEqual({ deleted: true });
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith('1');
  });
});
