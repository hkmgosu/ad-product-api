import { IsOptional, IsDateString } from 'class-validator';

export class GetReportDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  withPrice?: boolean;

  @IsOptional()
  withoutPrice?: boolean;
}
