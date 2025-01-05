import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    @ApiProperty({ example: 'emartinezd16@gmail.com', description: 'User email' })
    email: string;
  
    @IsString()
    @MinLength(8)
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'h4$hedPa$$word', description: 'User password' })
    password: string;
}
