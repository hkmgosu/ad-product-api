import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ProductsModule } from '../products/products.module';

// we are gonna reuse the product services in the report module
@Module({
  imports: [ProductsModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
