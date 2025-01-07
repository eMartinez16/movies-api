import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
      status: 200,
      description: 'Main',
      example: {        
          message: 'Welcome to movies api, here you can manage users and see movies using the SW api!',
          links: {
            login: '/api/v1/auth/login',
            register: '/api/v1/auth/register',
          }
      }
  })
  getHello() {
    return this.appService.getHello();
  }
}
