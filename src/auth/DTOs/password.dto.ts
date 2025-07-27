import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordReqDTO {
  @ApiProperty({
    description: 'User email address to send password reset link',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;
}

export class ForgotPasswordResDTO {
  @ApiProperty({
    description: 'Success message',
    example: 'Password reset email sent successfully',
    type: String,
  })
  message: string;
}

export class ResetPasswordReqDTO {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    description:
      'New password (minimum 8 characters, must contain uppercase, lowercase, and number)',
    example: 'NewPassword123',
    type: String,
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}

export class ResetPasswordResDTO {
  @ApiProperty({
    description: 'Success message',
    example: 'Password reset successfully',
    type: String,
  })
  message: string;
}
