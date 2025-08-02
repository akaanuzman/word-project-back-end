import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule,
    AuthModule,
    MailModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
