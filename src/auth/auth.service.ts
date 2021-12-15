import { BadRequestException, Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { CookieConfig } from './config';
import { RegisterDto } from './models/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  generateToken(payload): string {
    return this.jwtService.sign(payload);
  }

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

  async registerWithPhone(@Body() body: RegisterDto) {
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

  async loginWithEmailOrPhone(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response
  ) {
    const user = await this.usersService.findOne(email);
    const payload = { id: user.id };

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = this.generateToken(payload);

    response.cookie('jwt', jwt, CookieConfig());
    response.status(200).send({ message: 'Login Success' });
  }

  async logout(@Res() response: Response) {
    response.clearCookie('jwt');
    response.status(200).send({ message: 'Logout Success' });
  }
}
