import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create-job.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiPropertyOptional({ example: 'Software Engineer' })
  title: string;

  @ApiPropertyOptional({ example: 'Develop web applications...' })
  description: string;

  @ApiPropertyOptional({ example: 1800 })
  salary: number;

  @ApiPropertyOptional({ example: 'Tunis' })
  location: string;

  @ApiPropertyOptional({ example: 'Engineering' })
  category: string;
}