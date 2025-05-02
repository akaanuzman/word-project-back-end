/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginResDTO, LoginReqDTO } from './DTOs/login.dto';
import { RegisterResDTO, RegisterReqDTO } from './DTOs/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterReqDTO): Promise<RegisterResDTO> {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('This email address is already in use');
      }

      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(registerDto.password, 10);
      } catch (hashError) {
        throw new InternalServerErrorException(
          'Password hashing process failed',
        );
      }

      const newUser = await this.prisma.users.create({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          password: hashedPassword,
        },
      });

      const { password, ...userWithPasswordRemoved } = newUser;

      const token = this.jwtService.sign({
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      const response: RegisterResDTO = {
        user: userWithPasswordRemoved,
        token,
      };

      return response;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred during user registration',
      );
    }
  }

  async login(loginDto: LoginReqDTO): Promise<LoginResDTO> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      let passwordMatches: boolean;
      try {
        passwordMatches = await bcrypt.compare(
          loginDto.password,
          user.password,
        );
      } catch (compareError) {
        throw new InternalServerErrorException(
          'Password comparison process failed',
        );
      }

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { password, ...userWithoutPassword } = user;

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const response: LoginResDTO = {
        user: userWithoutPassword,
        token,
      };

      return response;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}
