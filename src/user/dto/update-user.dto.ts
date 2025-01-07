import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../core/enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
        @ApiProperty({ example: 'Emiliano', description: 'User name', required: false })
        name?: string;

        @ApiProperty({ example: 'emartinezd16@gmail.com', description: 'User email', required: false })
        email?: string;

        @ApiProperty({ example: 'h4$hedPa$$word', description: 'User password', required: false })
        password?: string;

        @ApiProperty({ example: 'admin', description: 'User role (admin or user)', required: false })
        role?: Role;

}
