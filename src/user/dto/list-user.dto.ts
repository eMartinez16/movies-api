import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Role } from "../../core/enum/role.enum";

export class ListUserDto {
    @IsString()
    @ApiProperty({ example: 'Emiliano', description: 'User name' })
    id: number;

    @IsString()
    @ApiProperty({ example: 'Emiliano', description: 'User name' })
    name: string;
  
    @IsEmail()
    @ApiProperty({ example: 'emartinezd16@gmail.com', description: 'User email' })
    email: string;
  
    @IsEnum(Role)
    @ApiProperty({ example: 'admin', description: 'User role (admin or user)' })
    role: Role;

    @IsDate()
    @ApiProperty({ example: 'admin', description: 'Creation date' })
    createdAt: Date;

    @IsDate()
    @ApiProperty({ example: '2025-01-06 01:20:26.847092', description: 'Update date' })
    updatedAt: Date;

    @IsDate()
    @ApiProperty({ example: 'null', description: 'Deleted date' })
    deletedAt: Date | null;
   
}
