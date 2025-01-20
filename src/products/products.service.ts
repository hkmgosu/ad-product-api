import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // every hour refresh
  async fetchProductsFromContentful() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://cdn.contentful.com/spaces/${this.configService.get<string>('CONTENTFUL_SPACE_ID')}/environments/${this.configService.get<string>('CONTENTFUL_ENVIRONMENT')}/entries?content_type=product`,
          {
            headers: {
              Authorization: `Bearer ${this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN')}`,
            },
          },
        ),
      );
      const products: Product[] = response.data.items.map(
        (item: {
          sys: { createdAt: Date };
          fields: { name: string; category: string; price: number };
        }) => ({
          name: item.fields.name,
          category: item.fields.category,
          price: item.fields.price,
          createdAt: item.sys.createdAt,
          deleted: false,
        }),
      );

      // ASSUMPTION: refresh the database collection every hour, comment the next line if you want to persist data.
      await this.productModel.deleteMany({});
      await this.productModel.insertMany(products);
    } catch (error) {
      // Handle contenful request error based on the type of error
      if (error.response) {
        // The request was made, but the server responded with an error
        throw new HttpException(
          {
            status: error.response.status,
            message: error.response.data.message || 'Error fetching entries',
          },
          error.response.status,
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new HttpException(
          {
            status: HttpStatus.GATEWAY_TIMEOUT,
            message: 'No response received from Contentful',
          },
          HttpStatus.GATEWAY_TIMEOUT,
        );
      } else {
        // Something happened in setting up the request
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(
    page: number,
    limit: number,
    filter?: {
      name: string | undefined;
      category: string | undefined;
      minPrice: number | undefined;
      maxPrice: number | undefined;
    },
  ): Promise<Product[]> {
    // allow users to remove products and these ones should not reappear when the app is restarted.
    const query = this.productModel.find({ deleted: false });

    if (filter) {
      if (filter.name) {
        query.where('name', new RegExp(filter.name, 'i'));
      }
      if (filter.category) {
        query.where('category', new RegExp(filter.category, 'i'));
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
    withPrice: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const totalProducts = await this.productModel.countDocuments();
    // If there are no non-deleted products, return 0 to avoid division by zero
    if (totalProducts === 0) {
      return 0;
    }
    const filteredProducts = await this.productModel.countDocuments({
      deleted: false,
      ...(withPrice === 'true'
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
      { $match: { deleted: false } },
      { $group: { _id: '$category', total: { $sum: 1 } } },
    ]);
  }
}
