import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';

// Mock Product DTO
const mockProductDto = {
  id: '123',
  name: 'Test Product',
  category: 'Test Category',
  price: 100,
};

// Mock Products
const mockProducts = [mockProductDto];

const mockProductModel = {
  create: jest.fn().mockResolvedValue(mockProductDto),
  find: jest.fn().mockResolvedValue(mockProducts),
  findOne: jest.fn().mockResolvedValue(mockProductDto),
  deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
};

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
