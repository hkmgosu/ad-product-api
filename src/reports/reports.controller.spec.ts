import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ProductsService } from '../products/products.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('ReportsController', () => {
  let controller: ReportsController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ProductsService;

  const mockProductsService = {
    getDeletedPercentage: jest.fn(),
    getNonDeletedPercentage: jest.fn(),
    getProductsByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        JwtService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return deleted percentage', async () => {
      mockProductsService.getDeletedPercentage.mockResolvedValue(20);
      const result = await controller.getDeletedPercentage();
      expect(result).toBe(20);
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return non-deleted percentage', async () => {
      mockProductsService.getNonDeletedPercentage.mockResolvedValue(60);
      const result = await controller.getNonDeletedPercentage(
        'true',
        '2023-01-01',
        '2023-01-31',
      );
      expect(result).toBe(60);
    });

    it('should throw BadRequestException if parameters are invalid', async () => {
      await expect(
        controller.getNonDeletedPercentage('invalid', '', ''),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const result = [
        { _id: 'category1', total: 5 },
        { _id: 'category2', total: 10 },
      ];
      mockProductsService.getProductsByCategory.mockResolvedValue(result);

      const products = await controller.getProductsByCategory();
      expect(products).toEqual(result);
    });
  });
});
