import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Role } from "src/core/enum/role.enum";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @ApiProperty({ example: 'Emiliano', description: 'User name' })
    name: string;
  
    @IsEmail()
    @ApiProperty({ example: 'emartinezd16@gmail.com', description: 'User email' })
    email: string;
  
    @IsString()
    @MinLength(8)
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'h4$hedPa$$word', description: 'User password' })
    password: string;


    @IsEnum(Role)
    @ApiProperty({ example: 'admin', description: 'User role' })
    role: Role;
}
