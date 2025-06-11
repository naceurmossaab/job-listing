import { IsString, IsOptional, IsInt, Min, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchJobDto {
  @ApiProperty({ example: 'Engineer', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Engineering', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumberString()
  @IsOptional()
  page?: number;
  
  @ApiProperty({ example: 10, required: false })
  @IsNumberString()
  @IsOptional()
  limit?: number;
}