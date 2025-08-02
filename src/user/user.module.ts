import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from 'src/config/config.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [ConfigModule, ImageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
