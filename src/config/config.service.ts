import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ConfigValueType = string | number | boolean;
type ConfigType = 'string' | 'number' | 'boolean';

interface ConfigField {
  type: ConfigType;
  key: string;
  defaultValue?: ConfigValueType;
}

type ConfigGroupSchema = Record<string, ConfigField>;
type ConfigGroup = Record<string, ConfigValueType>;

@Injectable()
export class AppConfigService {
  private readonly configGroups: Record<string, ConfigGroup> = {};

  readonly mail: Record<string, ConfigValueType> = this.registerConfigGroup(
    'mail',
    {
      host: { type: 'string', key: 'MAIL_HOST' },
      secure: { type: 'boolean', key: 'MAIL_SECURE' },
      port: { type: 'number', key: 'MAIL_PORT' },
      user: { type: 'string', key: 'MAIL_USER' },
      password: { type: 'string', key: 'MAIL_PASSWORD' },
      fromName: { type: 'string', key: 'MAIL_FROM_NAME' },
      from: { type: 'string', key: 'MAIL_FROM' },
    },
  );

  readonly jwt: Record<string, ConfigValueType> = this.registerConfigGroup(
    'jwt',
    {
      secret: { type: 'string', key: 'JWT_SECRET' },
      accessExpiration: { type: 'number', key: 'JWT_ACCESS_EXPIRATION' },
      refreshExpiration: { type: 'number', key: 'JWT_REFRESH_EXPIRATION' },
    },
  );

  readonly app: Record<string, ConfigValueType> = this.registerConfigGroup(
    'app',
    {
      port: { type: 'number', key: 'APP_PORT', defaultValue: 3000 },
      env: { type: 'string', key: 'NODE_ENV', defaultValue: 'development' },
      debug: { type: 'boolean', key: 'APP_DEBUG', defaultValue: false },
    },
  );

  constructor(private readonly configService: ConfigService) {}

  private registerConfigGroup(
    groupName: string,
    schema: ConfigGroupSchema,
  ): Record<string, ConfigValueType> {
    const group: Record<string, ConfigValueType> = {};

    Object.entries(schema).forEach(([fieldName, config]) => {
      Object.defineProperty(group, fieldName, {
        get: () => this.getValue(config.key, config.type, config.defaultValue),
        enumerable: true,
        configurable: false,
      });
    });

    this.configGroups[groupName] = group;
    return group;
  }

  private getValue(
    key: string,
    type: ConfigType,
    defaultValue?: ConfigValueType,
  ): ConfigValueType {
    const value = this.configService.get<string>(key);

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Missing required environment variable: ${key}`);
    }

    switch (type) {
      case 'string':
        return value;
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true' || value === 'True' || value === '1';
      default:
        return value;
    }
  }

  get<T = string>(key: string, defaultValue?: T): T {
    const value = this.configService.get<T>(key);
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value !== undefined ? value : (defaultValue as T);
  }

  getConfigGroup(
    groupName: string,
  ): Record<string, ConfigValueType> | undefined {
    return this.configGroups[groupName];
  }

  getAllConfig(): Record<string, Record<string, ConfigValueType>> {
    return { ...this.configGroups };
  }
}
