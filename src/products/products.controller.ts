import {
  Controller,
  Get,
  Query,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ConfigService } from '@nestjs/config';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all Products',
    description: 'Get all non deleted products',
    tags: ['Products'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Pagination number for Products to return',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of Products to return (max 5 for page)',
    example: 5,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Products filtered by name to return',
    example: 'Apple Mi Watch',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Products filtered by category to return',
    example: 'Smartwatch',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Products filtered by minimum price to return',
    example: 1400,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Products filtered by maximum price to return',
    example: 1800,
  })
  @ApiResponse({ status: 200, description: 'Retrieved products successfully.' })
  async findAll(@Query() query: FindAllProductsDto): Promise<Product[]> {
    const { page, limit, name, category, minPrice, maxPrice } = query;

    if (limit > 5) throw new BadRequestException('Limit need to be 5 or less');

    const filter = { name, category, minPrice, maxPrice };
    return this.productsService.findAll(Number(page), Number(limit), filter);
  }

  @ApiOperation({
    summary: 'Delete a Product',
    description: 'Delete product by id',
    tags: ['Products'],
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Delete a Product by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @Delete(':id')
  async remove(@Param() params: RemoveProductDto) {
    return this.productsService.deleteProduct(params.id);
  }
}
