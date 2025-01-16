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
    description: 'Number of Products to return',
    example: 5,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filters for pagination',
    example: "{ name: 'Dell', category: 'Laptop' }",
  })
  @ApiResponse({ status: 200, description: 'Retrieved products successfully.' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('filter')
    filter: {
      name: string;
      category: string;
      minPrice: number;
      maxPrice: number;
    },
  ): Promise<Product[]> {
    if (limit > 5) throw new BadRequestException('Limit need to be 5 or less');
    return this.productsService.findAll(Number(page), Number(limit), filter);
  }

  @ApiOperation({
    summary: 'Delete a Product',
    description: 'Delete products',
    tags: ['Products'],
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Delete a Product id',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  // @Get('/testing')
  // async getHello(): Promise<any> {
  //   console.log(
  //     'call content',
  //     await this.productsService.fetchProductsFromContentful(),
  //   );
  //   return (
  //     'Hello BOBBY' + this.configService.get<string>('CONTENTFUL_ENVIRONMENT')
  //   );
  // }
}
