import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../utils/constants";
import { IsEnum } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  login: string;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  @IsEnum(Role)
  role: Role;
}