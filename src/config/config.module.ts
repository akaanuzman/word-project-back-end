import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';

function validateEnvVariables(
  config: Record<string, any>,
): Record<string, any> {
  const requiredEnvVars = [
    'MAIL_HOST',
    'MAIL_SECURE',
    'MAIL_PORT',
    'MAIL_USER',
    'MAIL_PASSWORD',
    'MAIL_FROM_NAME',
    'MAIL_FROM',
    'JWT_SECRET',
    'JWT_ACCESS_EXPIRATION',
    'JWT_REFRESH_EXPIRATION',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => config[envVar] === undefined,
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  return config;
}

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVariables,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
