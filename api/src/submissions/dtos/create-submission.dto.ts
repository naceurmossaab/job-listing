import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'Jhon Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  motivationLetter?: string;
  
  @IsString()
  @IsOptional()
  cvUrl?: string;

  @ApiProperty()
  @IsNumberString()
  jobId: number;
}
