import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDTO, RegisterResDTO } from './DTOs/register.dto';
import { LoginReqDTO, LoginResDTO } from './DTOs/login.dto';
import {
  ForgotPasswordReqDTO,
  ForgotPasswordResDTO,
} from './DTOs/password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginReqDTO): Promise<LoginResDTO> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterReqDTO): Promise<RegisterResDTO> {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordReqDTO,
  ): Promise<ForgotPasswordResDTO> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
