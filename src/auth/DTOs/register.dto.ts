import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterReqDTO {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}

export interface RegisterResDTO {
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
