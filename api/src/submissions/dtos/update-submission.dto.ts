import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSubmissionDto } from './create-submission.dto';
import { PartialType } from "@nestjs/mapped-types";

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {
  @ApiPropertyOptional()
  fullName: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  motivationLetter?: string;

  @ApiPropertyOptional()
  cvUrl: string;

  @ApiPropertyOptional()
  jobId: number;
}
