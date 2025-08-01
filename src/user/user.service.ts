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
}
