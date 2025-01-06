import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../core/enum/role.enum';
import { Roles } from '../core/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ApiCommonResponses } from '../core/decorators/api.responses.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { ListUserDto } from './dto/list-user.dto';

@ApiTags('Users') 
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  @Roles([Role.ADMIN_USER])
   @ApiResponse({
      status: 200,
      description: 'User created successfully'
    })
  @ApiOperation({ summary: 'Generate new user' })
  @ApiBody({ description: 'User information', type: CreateUserDto })
  @ApiCommonResponses()
  create(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Users list',
    type: ListUserDto,
    isArray: true  
  })
  @ApiCommonResponses()
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: ListUserDto   
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiCommonResponses()  
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this._userService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: ListUserDto
  })
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',  
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',  
  })
  @ApiOperation({ summary: 'Remove user' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()
  remove(@Param('id', ParseIntPipe) id: string) {
    return this._userService.delete(+id);
  }
}
