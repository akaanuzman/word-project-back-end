import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDTO } from './DTOs/users.response';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<UserResponseDTO[]> {
    const users = await this.prisma.users.findMany();
    return UserResponseDTO.fromUsers(users);
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserResponseDTO.fromUser(user);
  }

  async updateUserLevel(id: string, level: number): Promise<UserResponseDTO> {
    const user = await this.prisma.users.update({
      where: { id },
      data: { current_level: level },
    });
    return UserResponseDTO.fromUser(user);
  }

  async updateUserXp(id: string, xp: number): Promise<UserResponseDTO> {
    const user = await this.prisma.users.update({
      where: { id },
      data: { xp },
    });
    return UserResponseDTO.fromUser(user);
  }

  async updateUserCoins(id: string, coins: number): Promise<UserResponseDTO> {
    const user = await this.prisma.users.update({
      where: { id },
      data: { coins },
    });
    return UserResponseDTO.fromUser(user);
  }

  async updateUserStreak(id: string, streak: number): Promise<UserResponseDTO> {
    const user = await this.prisma.users.update({
      where: { id },
      data: { streak },
    });
    return UserResponseDTO.fromUser(user);
  }

  async updateUserIsPremium(
    id: string,
    isPremium: boolean,
  ): Promise<UserResponseDTO> {
    const user = await this.prisma.users.update({
      where: { id },
      data: { is_premium: isPremium },
    });
    return UserResponseDTO.fromUser(user);
  }
}
