import { IsString } from 'class-validator';

export class RemoveProductDto {
  @IsString()
  id: string;
}
