import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // every hour
  async fetchProductsFromContentful() {
    console.log('every ', new Date().getTime().toLocaleString());
    const response = await this.httpService
      .get(
        `https://cdn.contentful.com/spaces/${this.configService.get<string>('CONTENTFUL_SPACE_ID')}/environments/${this.configService.get<string>('CONTENTFUL_ENVIRONMENT')}/entries?content_type=product`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN')}`,
          },
        },
      )
      .toPromise();

    const products = response.data.items.map((item) => ({
      name: item.fields.name,
      category: item.fields.category,
      price: item.fields.price,
    }));

    console.log(products);

    await this.productModel.deleteMany({});
    await this.productModel.insertMany(products);
  }

  async findAll(page: number, limit: number, filter: any): Promise<Product[]> {
    const query = this.productModel.find({ deleted: false });

    if (filter.name) {
      query.where('name', new RegExp(filter.name, 'i'));
    }
    if (filter.category) {
      query.where('category', filter.category);
    }
    if (filter.priceRange) {
      query.where('price').gte(filter.priceRange[0]).lte(filter.priceRange[1]);
    }

    return query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async deleteProduct(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
    return product;
  }

  async getDeletedPercentage(): Promise<number> {
    const total = await this.productModel.countDocuments();
    const deleted = await this.productModel.countDocuments({ deleted: true });
    return (deleted / total) * 100;
  }

  async getNonDeletedWithPriceCount(): Promise<number> {
    return this.productModel.countDocuments({
      deleted: false,
      price: { $exists: true },
    });
  }

  async getNonDeletedWithoutPriceCount(): Promise<number> {
    return this.productModel.countDocuments({
      deleted: false,
      price: { $exists: false },
    });
  }

  // Add methods for custom date range query and other reports as needed
}
