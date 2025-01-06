import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Role } from '../core/enum/role.enum';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        email: 'emiliano@example.com',
        password: 'password123',
        name: 'Emiliano Martinez',
        role: Role.ADMIN_USER
      };

      const savedUser = {
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(savedUser);

      expect(await userService.create(createUserDto)).toEqual({
        message: 'User created successfully',
      });
    });

    it('should throw an error if email is already in use', async () => {
      const createUserDto = {
        email: 'emiliano@example.com',
        password: 'password123',
        name: 'Emiliano Martinez',
        role: Role.ADMIN_USER
      };

      const existingUser = { ...createUserDto };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      try {
        await userService.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email already in use');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        { email: 'emiliano@example.com', name: 'Emiliano Martinez' },
        { email: 'emidos@example.com', name: 'Emi dos' },
      ];

      mockUserRepository.find.mockResolvedValue(result);

      expect(await userService.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = { email: 'emiliano@example.com', name: 'Emiliano Martinez' };

      mockUserRepository.findOne.mockResolvedValue(result);

      expect(await userService.findOne(1)).toBe(result);
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await userService.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        password: 'newpassword',
        name: 'Updated Name',
      };
    
      const existingUser = { id: 1, email: 'john@example.com', name: 'John Doe', password: 'password123' };
    
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({ ...existingUser, ...updateUserDto });
    
      const updatedUser = await userService.update(1, updateUserDto);
      
      expect(updatedUser.email).toEqual('updated@example.com');
      expect(updatedUser.name).toEqual('Updated Name');
      
      expect(updatedUser.password).not.toEqual('password123');
    });

    it('should throw an error if user to update is not found', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        password: 'newpassword',
        name: 'Updated Name',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await userService.update(1, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const existingUser = { id: 1, email: 'emiliano@example.com', name: 'Emiliano Martinez' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 1 });

      expect(await userService.delete(1)).toEqual({ affected: 1 });
    });

    it('should throw an error if user to delete is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await userService.delete(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
