import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/auth/constants';
import { User } from './models/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // * It is visible outside this module
})
export class UsersModule {}
