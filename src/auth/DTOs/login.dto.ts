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
    email: string;
    username: string;
    id: string;
    profile_image: string | null;
    is_premium: boolean;
    current_level: number;
    xp: number;
    coins: number;
    streak: number;
    isActive: boolean;
    role: string;
    last_login: Date | null;
    reset_token: string | null;
    reset_token_expiration: Date | null;
    created_at: Date;
    updated_at: Date;
  };
  token: string;
}
