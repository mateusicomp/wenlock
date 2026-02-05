import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, Length, Matches } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: "a1b2c3",
    description: "6 chars, alphanumeric",
  })
  @IsOptional()
  @Length(6, 6, { message: "password must be exactly 6 characters" })
  @Matches(/^[A-Za-z0-9]+$/, { message: "password must be alphanumeric" })
  password?: string;
}
