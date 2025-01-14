import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ConfigService } from '@nestjs/config';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private configService: ConfigService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query() filter: any,
  ): Promise<Product[]> {
    return this.productsService.findAll(Number(page), Number(limit), filter);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Get('/testing')
  async getHello(): Promise<any> {
    console.log(
      'call content',
      await this.productsService.fetchProductsFromContentful(),
    );
    return (
      'Hello BOBBY' + this.configService.get<string>('CONTENTFUL_ENVIRONMENT')
    );
  }
}
