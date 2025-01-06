import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from  "bcryptjs";
import { UserService } from '../../user/user.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse, RegisterResponse } from './responses/auth.responses';
import { RegisterDto } from './dto/register.dto';
import { JWTPayload } from './interfaces/jwt.payload';


@Injectable()
export class AuthService {
    constructor(
      private readonly _userService: UserService,
      private readonly _jwtAuthService: JwtService
    ) {}

    async register({ email, name, password, role}: RegisterDto): Promise<RegisterResponse> {
      const user = await this._userService.findByEmail(email);
    
      if (user)
        throw new BadRequestException("Email already exists");
      

      await this._userService.create({
        name,
        email,
        password,
        role
      });
  
      return {
        message: "User created successfully",
      };              
    }
 
    async login(dto: LoginAuthDto): Promise<LoginResponse> {
      const { email, password } = dto;
      const userFinded = await this._userService.findByEmail(email);
  
      if (!userFinded)
        throw new UnauthorizedException("Invalid email");
      

      console.log(password, userFinded);
      const invalidPassword = await bcrypt.compare(
        password,
        userFinded.password
      );

  
      if (!invalidPassword)
        throw new UnauthorizedException("Invalid password");
      
      const payload = {
        id: userFinded.id,
        name: userFinded.name,
      };

      delete userFinded.password;

      const token = this._jwtAuthService.sign(payload);

      return {
        user: userFinded,      
        token,
      }
    }

}
