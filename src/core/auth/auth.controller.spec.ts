import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role } from '../enum/role.enum';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return success message when user registers', async () => {
      mockAuthService.register.mockResolvedValue({ message: 'User created successfully' });

      const registerDto: RegisterDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: Role.DEFAULT_USER,
      };

      const result = await authController.signIn(registerDto);

      expect(result).toEqual({ message: 'User created successfully' });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException when email already exists', async () => {
      mockAuthService.register.mockRejectedValue(new BadRequestException('Email already exists'));

      const registerDto: RegisterDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: Role.DEFAULT_USER,
      };

      await expect(authController.signIn(registerDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return a token and user information when login is successful', async () => {
      mockAuthService.login.mockResolvedValue({
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
      });

      const loginDto: LoginAuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        token: 'fake-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when email is invalid', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid email'));

      const loginDto: LoginAuthDto = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid password'));

      const loginDto: LoginAuthDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
