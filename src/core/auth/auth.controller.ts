import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '../decorators/api.responses.decorator';


@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
    constructor(
      private readonly _authService: AuthService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ description: 'Sign in information', type: RegisterDto })
    @ApiCommonResponses()   
    @ApiResponse({
      status: 200,
      description: 'User created successful.',
      schema: {
        example: {
          message: "User created successfully",
        },
      },
    })
    signIn(@Body() registerDto: RegisterDto){
      return this._authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ description: 'Credentials to login', type: LoginAuthDto })
    @ApiResponse({
      status: 200,
      description: 'Login successful.',
      schema: {
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: '{ id: 1, name: Emiliano, email: emartinezd16@gmail.com..}',
        },
      },
    })
    login(@Body() loginDto: LoginAuthDto) {
      return this._authService.login(loginDto);
    }
}
