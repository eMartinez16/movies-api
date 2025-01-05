import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to movies api, here you can manage users and see movies using the SW api!',
      links: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
      },
    };  
  }
}
