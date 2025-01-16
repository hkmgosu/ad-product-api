import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.productsService.getDeletedPercentage();
  }

  @UseGuards(JwtAuthGuard)
  @Get('non-deleted-percentage')
  async getNonDeletedPercentage(
    @Query('withPrice') withPrice: boolean,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.productsService.getNonDeletedPercentage(
      withPrice,
      new Date(startDate),
      new Date(endDate),
    );
  }

  // custom report
  @UseGuards(JwtAuthGuard)
  @Get('get-products-by-category')
  async getProductsByCategory() {
    return this.productsService.getProductsByCategory();
  }
}
