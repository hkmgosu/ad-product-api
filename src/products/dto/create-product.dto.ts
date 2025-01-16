// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: `this is the name of the product created`,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: `this is the category of the product created`,
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: `this is the price of the product created`,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: `this is the deleted field of the product created`,
  })
  @IsNotEmpty()
  @IsBoolean()
  deleted: boolean;
}
