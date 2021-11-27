import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
