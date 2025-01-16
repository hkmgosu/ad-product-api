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

    const products = response.data.items.map(
      (item: {
        fields: { name: string; category: string; price: number };
      }) => ({
        name: item.fields.name,
        category: item.fields.category,
        price: item.fields.price,
      }),
    );

    await this.productModel.deleteMany({});
    await this.productModel.insertMany(products);
  }

  async findAll(
    page: number,
    limit: number,
    filter: {
      name: string;
      category: string;
      minPrice: number;
      maxPrice: number;
    },
  ): Promise<Product[]> {
    // allow users to remove products and these ones should not reappear when the app is restarted.
    const query = this.productModel.find({ deleted: false });

    if (filter.name) {
      query.where('name', new RegExp(filter.name, 'i'));
    }
    if (filter.category) {
      query.where('category', filter.category);
    }
    if (filter.minPrice && !filter.maxPrice) {
      query.where('price').gte(filter.minPrice);
    }
    if (!filter.minPrice && filter.maxPrice) {
      query.where('price').lte(filter.maxPrice);
    }
    if (filter.minPrice && filter.maxPrice) {
      query.where('price').gte(filter.minPrice).lte(filter.maxPrice);
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

  async getNonDeletedPercentage(
    withPrice: boolean,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const totalProducts = await this.productModel.countDocuments({
      isDeleted: false,
    });
    const filteredProducts = await this.productModel.countDocuments({
      isDeleted: false,
      ...(withPrice
        ? { price: { $exists: true } }
        : { price: { $exists: false } }),
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return (filteredProducts / totalProducts) * 100;
  }

  // custom report
  async getProductsByCategory(): Promise<any> {
    // array of documents where each document represents a category of products
    // and includes the count of products within that category that are not deleted.
    return this.productModel.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$category', total: { $sum: 1 } } },
    ]);
  }
}
