import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterReqDTO {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}

export interface RegisterResDTO {
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
