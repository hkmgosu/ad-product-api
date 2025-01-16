import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from '../products/products.service';
import { getModelToken } from '@nestjs/mongoose';
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

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ReportsController],
      providers: [
        JwtService,
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
