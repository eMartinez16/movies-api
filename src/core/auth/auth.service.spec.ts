import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '../enum/role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      await expect(
        authService.register({ email: 'test@example.com', name: 'Test', password: '123456', role: Role.DEFAULT_USER }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create the user', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      (userService.create as jest.Mock).mockResolvedValue({ message: 'User created successfully' });
        
      const result = await authService.register({
        email: 'test@example.com',
        name: 'Test',
        password: 'hashedPassword',
        role: Role.DEFAULT_USER,  
      });  
     
  
      expect(userService.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.DEFAULT_USER,  
      });
  
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if email is invalid', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'invalid@example.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return token and user data if login is successful', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);    
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockedToken');


      const result = await authService.login({ email: 'test@example.com', password: '123456' });

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: mockUser.id
      });
      expect(result).toEqual({
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'mockedToken',
      });
    });
  });
});
