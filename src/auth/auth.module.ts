import { Module } from '@nestjs/common';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController]
})
export class AuthModule {}
