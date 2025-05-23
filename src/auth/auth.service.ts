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
import * as crypto from 'crypto';
import {
  ForgotPasswordReqDTO,
  ForgotPasswordResDTO,
  ResetPasswordReqDTO,
  ResetPasswordResDTO,
} from './DTOs/password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
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

  async forgotPassword(
    body: ForgotPasswordReqDTO,
  ): Promise<ForgotPasswordResDTO> {
    try {
      const { email } = body;
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid email address provided for reset',
        );
      }

      const randomHexString = crypto.randomBytes(16).toString('hex');
      const resetPasswordToken = crypto
        .createHash('SHA256')
        .update(randomHexString)
        .digest('hex');

      const resetTokenExpiration = new Date(Date.now() + 3600000);

      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          reset_token: resetPasswordToken,
          reset_token_expiration: resetTokenExpiration,
        },
      });

      const response: ForgotPasswordResDTO = {
        message: 'Reset token generated successfully',
      };

      await this.emailService.sendPasswordResetMail(
        user.email,
        user.username,
        resetPasswordToken,
      );

      return response;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred during password reset',
      );
    }
  }

  async resetPassword(body: ResetPasswordReqDTO): Promise<ResetPasswordResDTO> {
    try {
      const { token, password } = body;

      if (!token) {
        throw new UnauthorizedException('Reset token is required');
      }

      if (!password) {
        throw new UnauthorizedException('Password is required');
      }

      // Find user with this reset token
      const user = await this.prisma.users.findFirst({
        where: {
          reset_token: token,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // Check if token has expired
      const now = new Date();
      if (!user.reset_token_expiration) {
        throw new UnauthorizedException('Reset token is invalid');
      }

      // Compare dates to check if token is expired
      if (user.reset_token_expiration < now) {
        console.log(
          `Token expired: Token expiry date ${user.reset_token_expiration.toISOString()}, Current date: ${now.toISOString()}`,
        );
        throw new UnauthorizedException(
          'Reset token has expired. Please request a new password reset.',
        );
      }

      // Hash the new password
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashError) {
        throw new InternalServerErrorException(
          'Password hashing process failed',
        );
      }

      // Update user with new password and clear reset token fields
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          reset_token: null,
          reset_token_expiration: null,
        },
      });

      return {
        message: 'Your password has been successfully reset',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred during password reset',
      );
    }
  }
}
