import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../core/enum/role.enum';
import { Roles } from '../core/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '../core/decorators/api.responses.decorator';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()  
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this._userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user' })
  @ApiParam({ name: 'id', description: 'user id', type: 'number' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCommonResponses()
  remove(@Param('id', ParseIntPipe) id: string) {
    return this._userService.delete(+id);
  }
}
