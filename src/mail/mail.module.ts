import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { AppConfigService } from 'src/config/config.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
        transport: {
          service: 'gmail',
          host: configService.mail.host as string,
          port: configService.mail.port as number,
          secure: configService.mail.secure as boolean,
          auth: {
            user: configService.mail.user as string,
            pass: configService.mail.password as string,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"${configService.mail.fromName as string}" <${configService.mail.from as string}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
