import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDTO {
  @ApiProperty({
    description: 'User email address or username',
    example: 'user@example.com',
    type: String,
  })
  @IsNotEmpty({ message: 'Email or username is required' })
  identifier: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class LoginResDTO {
  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
      username: { type: 'string', example: 'john_doe' },
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      profile_image: { type: 'string', nullable: true, example: null },
      is_premium: { type: 'boolean', example: false },
      current_level: { type: 'number', example: 1 },
      xp: { type: 'number', example: 0 },
      coins: { type: 'number', example: 100 },
      streak: { type: 'number', example: 0 },
      isActive: { type: 'boolean', example: true },
      role: { type: 'string', example: 'user' },
      last_login: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: null,
      },
      reset_token: { type: 'string', nullable: true, example: null },
      reset_token_expiration: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: null,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z',
      },
    },
  })
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

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  token: string;
}
