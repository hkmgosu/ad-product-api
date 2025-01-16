import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @ApiProperty({
    type: String,
    description: 'Name of the Product',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Category of the Product',
  })
  @Prop()
  category: string;

  @ApiProperty({
    type: Number,
    description: 'Price of the Product',
  })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    type: Boolean,
    description: 'Delete field for the Product',
  })
  @Prop({ default: false })
  deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
