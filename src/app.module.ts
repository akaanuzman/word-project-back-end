import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { ImageModule } from './image/image.module';
import { WordsModule } from './words/words.module';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { GuardsModule } from './common/guards/guards.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule,
    AuthModule,
    MailModule,
    ImageModule,
    WordsModule,
    GuardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
