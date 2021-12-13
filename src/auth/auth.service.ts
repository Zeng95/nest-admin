import { BadRequestException, Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './models/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async registerWithEmail(@Body() body: RegisterDto) {
    if (body.password !== body.passwordConfirmed) {
      throw new BadRequestException('Passwords do not match');
    }

    const saltOrRounds = 12;
    const hash = await bcrypt.hash(body.password, saltOrRounds);

    return this.usersService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hash
    });
  }

  async loginWithEmail(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.usersService.findOne(email);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      user,
      access_token: this.jwtService.sign({ id: user.id })
    };
  }

  async logout(@Res() response: Response) {
    response.clearCookie('jwt');
    response.status(200).send({ message: 'Success' });
  }
}
