import { Product } from '../schemas/product.schema';

export class PaginatedProductsDto {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
