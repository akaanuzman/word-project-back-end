/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendWelcomeMail(email: string, username: string): Promise<void> {
    try {
      this.logger.log(`Sending welcome email to ${email}`);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to WordWave!',
        template: './welcome.hbs',
        context: {
          username,
          date: new Date(),
        },
      });
      this.logger.log(`Welcome email sent to ${email} successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendPasswordResetMail(
    email: string,
    username: string,
    token: string,
  ): Promise<void> {
    try {
      const url = `http://localhost:3000/reset-password?token=${token}`;
      this.logger.log(`Sending password reset email to ${email}`);

      const imagesPath = join(process.cwd(), 'src/mail/templates/images');

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: './password-reset.hbs',
        context: {
          username,
          url,
        },
        attachments: [
          {
            filename: 'aubergine.png',
            path: join(imagesPath, 'aubergine.png'),
            cid: 'aubergine',
          },
          {
            filename: 'tomato.png',
            path: join(imagesPath, 'tomato.png'),
            cid: 'tomato',
          },
        ],
      });
      this.logger.log(`Password reset email sent to ${email} successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendCustomMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      this.logger.log(`Sending custom email to ${to}`);
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Custom email sent to ${to} successfully`);
    } catch (error) {
      this.logger.error(`Failed to send custom email to ${to}`, error.stack);
      throw error;
    }
  }
}
