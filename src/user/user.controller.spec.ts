import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '../core/enum/role.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Emiliano Martinez',
        email: 'emartinez@example.com',
        password: 'password123',
        role: Role.ADMIN_USER,
      };

      mockUserService.create.mockResolvedValue('User created successfully');
      
      expect(await userController.create(createUserDto)).toBe('User created successfully');
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Emiliano Martinez',
        email: 'emartinez@example.com',
        password: 'password123',
        role: Role.ADMIN_USER,
      };

      mockUserService.create.mockRejectedValue(new BadRequestException('User already exists'));

      try {
        await userController.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User already exists');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ name: 'Emiliano Martinez', email: 'emartinez@example.com' }];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = { name: 'Emiliano Martinez', email: 'emartinez@example.com' };
      mockUserService.findOne.mockResolvedValue(result);

      expect(await userController.findOne('1')).toBe(result);
    });

    it('should throw an error if user not found', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException('User not found'));

      try {
        await userController.findOne('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Emiliano Martinez Updated',
        email: 'emartinez.updated@example.com',
      };

      mockUserService.update.mockResolvedValue('User updated successfully');

      expect(await userController.update('1', updateUserDto)).toBe('User updated successfully');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.delete.mockResolvedValue('User deleted successfully');
      expect(await userController.remove('1')).toBe('User deleted successfully');
    });
  });
});
