import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

// Mock Product DTO
const mockProductDto = {
  id: '123',
  name: 'Test Product',
  category: 'Test Category',
  price: 100,
};

// Mock Products
const mockProducts = [mockProductDto];

// Mock Product Model
const mockProductModel = {
  create: jest.fn().mockResolvedValue(mockProductDto),
  find: jest.fn().mockResolvedValue(mockProducts),
  findAll: jest.fn().mockResolvedValue(mockProductDto),
  deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
};

describe('productsService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  // it('should fetch data from Contentful and save it', async () => {
  //   await productsService.fetchProductsFromContentful();
  //   expect(mockProductModel.create).toHaveBeenCalledWith(mockProducts);
  // });

  // it('should retrieve products', async () => {
  //   const products = await productsService.findAll(1, 5);
  //   expect(products).toEqual(mockProducts);
  // });

  // it('should delete a product', async () => {
  //   const result = await productsService.deleteProduct('123');
  //   expect(result).toBe(1);
  // });
});
