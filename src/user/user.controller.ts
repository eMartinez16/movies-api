import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/core/enum/role.enum';
import { Roles } from 'src/core/decorators/role.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/core/decorators/api.responses.decorator';

@ApiTags('Users') 
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN_USER)
  @ApiOperation({ summary: 'Generate new user' })
  @ApiBody({ description: 'User information', type: CreateUserDto })
  @ApiCommonResponses()
  create(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiCommonResponses()
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiCommonResponses()
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this._userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiCommonResponses()
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number' })
  @ApiCommonResponses()
  remove(@Param('id', ParseIntPipe) id: string) {
    return this._userService.delete(+id);
  }
}
