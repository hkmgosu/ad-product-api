import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Deleted Percentage Products',
    description: 'Shows the percentage of products deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved deleted percentage products successfully..',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.productsService.getDeletedPercentage();
  }

  @ApiOperation({
    summary: 'Non Deleted Percentage Products',
    description: 'Shows the percentage of products non deleted',
  })
  @ApiQuery({
    name: 'withPrice',
    required: true,
    type: Boolean,
    description: 'Products filtered by the price, if exist, to return',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: Date,
    description: 'Products filtered by start date range to return',
    example: '01-02-2023',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: Date,
    description: 'Products filtered by end date range to return',
    example: '01-05-2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved non deleted percentage products successfully..',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('non-deleted-percentage')
  async getNonDeletedPercentage(
    @Query('withPrice') withPrice: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate || withPrice == undefined)
      throw new BadRequestException(
        'Need to provide withPrice, start Date and End Date',
      );
    if (!['true', 'false'].includes(withPrice.toLocaleLowerCase()))
      throw new BadRequestException('WithPrice need to be true or false');
    return this.productsService.getNonDeletedPercentage(
      withPrice.toLocaleLowerCase(),
      new Date(startDate),
      new Date(endDate),
    );
  }

  // custom report
  @ApiOperation({
    summary: 'Products by Category',
    description: 'Shows products by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved products by category successfully..',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('get-products-by-category')
  async getProductsByCategory() {
    return this.productsService.getProductsByCategory();
  }
}
