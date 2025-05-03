import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeMail(email: string, username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Hoşgeldiniz!',
      template: './welcome',
      context: {
        username,
        date: new Date(),
      },
    });
  }

  async sendPasswordResetMail(
    email: string,
    username: string,
    token: string,
  ): Promise<void> {
    const url = `https://your-frontend-app.com/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Şifre Sıfırlama',
      template: './password-reset',
      context: {
        username,
        url,
      },
    });
  }

  async sendCustomMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
