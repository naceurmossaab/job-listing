import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Role } from "../../utils/constants";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}