// app.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return the correct response from getHello', () => {
    const expectedResult = {
      message: 'Welcome to movies api, here you can manage users and see movies using the SW api!',
      links: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
      },
    };

    jest.spyOn(appService, 'getHello').mockReturnValue(expectedResult);

    expect(appController.getHello()).toEqual(expectedResult);
  });
});
