import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    HttpModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
