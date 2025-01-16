import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProductsModule } from 'src/products/products.module';

// we are gonna reuse the product services in the report module
@Module({
  imports: [ProductsModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
