import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Mateus Santos", maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, {
    message: "name must contain only letters and spaces",
  })
  name!: string;

  @ApiProperty({ example: "mateus@email.com", maxLength: 40 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "1234", minLength: 4, maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  @Matches(/^[0-9]+$/, { message: "registration must contain only digits" })
  registration!: string;

  @ApiProperty({
    example: "a1b2c3",
    description: "6 chars, alphanumeric",
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "password must be exactly 6 characters" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "password must be alphanumeric",
  })
  password!: string;
}
