import { IsString, MinLength, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Develop web applications...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1800 })
  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @ApiProperty({ example: 'Tunis' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  category: string;
}