import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { GlobalJwtGuard } from './global-jwt.guard';
import { AppConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwt.secret as string,
        signOptions: {
          expiresIn: configService.jwt.accessExpiration as string | number,
        },
      }),
    }),
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtGuard,
    },
  ],
})
export class GuardsModule {}
