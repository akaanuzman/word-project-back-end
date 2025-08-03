import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDTO, RegisterResDTO } from './DTOs/register.dto';
import { LoginReqDTO, LoginResDTO } from './DTOs/login.dto';
import {
  ForgotPasswordReqDTO,
  ForgotPasswordResDTO,
  ResetPasswordReqDTO,
  ResetPasswordResDTO,
} from './DTOs/password.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User Login',
    description:
      'Authenticate user with email/username and password to receive access token. Use the returned token in the Authorize button above for other endpoints.',
  })
  @ApiBody({ type: LoginReqDTO })
  @ApiResponse({
    status: 200,
    description:
      'Login successful - Copy the token and use it in the Authorize button',
    type: LoginResDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials or validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid email/username or password',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginReqDTO): Promise<LoginResDTO> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'User Registration',
    description:
      'Create a new user account with email, username, and password. Use the returned token in the Authorize button above for other endpoints.',
  })
  @ApiBody({ type: RegisterReqDTO })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully - Copy the token and use it in the Authorize button',
    type: RegisterResDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or username already exists',
  })
  @Post('register')
  register(@Body() registerDto: RegisterReqDTO): Promise<RegisterResDTO> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'Forgot Password',
    description: "Send password reset email to user's email address",
  })
  @ApiBody({ type: ForgotPasswordReqDTO })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    type: ForgotPasswordResDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with provided email',
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordReqDTO,
  ): Promise<ForgotPasswordResDTO> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset user password using token received via email',
  })
  @ApiBody({ type: ResetPasswordReqDTO })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordReqDTO,
  ): Promise<ResetPasswordResDTO> {
    // Don't log the actual password for security
    return this.authService.resetPassword(resetPasswordDto);
  }
}
