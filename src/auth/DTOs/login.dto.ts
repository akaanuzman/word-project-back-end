import { IsEmail, IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class LoginReqDTO {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsBoolean({ message: 'rememberMe must be a boolean value' })
  rememberMe: boolean;
}

export interface LoginResDTO {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    update_date: Date | null;
    create_date: Date | null;
  };
  token: string;
}
