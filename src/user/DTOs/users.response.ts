import { ApiProperty } from '@nestjs/swagger';
import { users } from '@prisma/client';

export class UserResponseDTO {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
    nullable: true,
    type: String,
  })
  profile_image: string | null;

  @ApiProperty({
    description: 'Premium subscription status',
    example: false,
    type: Boolean,
  })
  is_premium: boolean;

  @ApiProperty({
    description: 'Current user level',
    example: 5,
    type: Number,
  })
  current_level: number;

  @ApiProperty({
    description: 'User experience points',
    example: 1250,
    type: Number,
  })
  xp: number;

  @ApiProperty({
    description: 'User coins balance',
    example: 500,
    type: Number,
  })
  coins: number;

  @ApiProperty({
    description: 'User login streak count',
    example: 7,
    type: Number,
  })
  streak: number;

  @ApiProperty({
    description: 'User account active status',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User role in the system',
    example: 'user',
    type: String,
    enum: ['user', 'admin', 'moderator'],
  })
  role: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last account update timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updated_at: Date;

  constructor(user: users) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.profile_image = user.profile_image;
    this.is_premium = user.is_premium;
    this.current_level = user.current_level;
    this.xp = user.xp;
    this.coins = user.coins;
    this.streak = user.streak;
    this.isActive = user.isActive;
    this.role = user.role;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }

  static fromUser(user: users): UserResponseDTO {
    return new UserResponseDTO(user);
  }

  static fromUsers(users: users[]): UserResponseDTO[] {
    return users.map((user) => new UserResponseDTO(user));
  }
}
