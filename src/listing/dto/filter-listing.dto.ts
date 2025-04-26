import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterListingDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['available', 'rented', 'inactive'] })
  @IsOptional()
  @IsEnum(['available', 'rented', 'inactive'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
