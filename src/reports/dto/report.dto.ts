import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class GetReportDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  withPrice?: boolean;
}
