import { BadRequestException, Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { EmailRegistrationDTO, PhoneRegistrationDTO } from './models/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  generateToken(payload: { id: string }): string {
    return this.jwtService.sign(payload);
  }

  async validateUser(pass: string, phone?: string, email?: string) {
    let user;

    if (phone) {
      user = await this.usersService.findOneWithPhone(phone);
    } else {
      user = await this.usersService.findOneWithEmail(email);
    }

    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerWithPhone(@Body() body: PhoneRegistrationDTO) {
    try {
      const { password, passwordConfirmed, firstName, lastName, phone, countryCode } = body;

      if (password !== passwordConfirmed) {
        throw new BadRequestException('Passwords do not match');
      }

      const saltOrRounds = 12;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const payload = { firstName, lastName, phone, countryCode, password: hash };

      return this.usersService.create(payload);
    } catch (e) {
      console.error('registerWithPhone:', e);
    }
  }

  async registerWithEmail(@Body() body: EmailRegistrationDTO) {
    try {
      const { password, passwordConfirmed, firstName, lastName, email } = body;

      if (password !== passwordConfirmed) {
        throw new BadRequestException('Passwords do not match');
      }

      const saltOrRounds = 12;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const payload = { firstName, lastName, email, password: hash };

      return this.usersService.create(payload);
    } catch (e) {
      console.error('registerWithEmail:', e);
    }
  }

  async loginWithEmailOrPhone() {
    const user = await this.usersService.findOne(email);
    const payload = { id: user.id };

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = this.generateToken(payload);

    return jwt;
  }

  async logout(@Res() response: Response) {
    response.clearCookie('jwt');
    response.status(200).send({ message: 'Logout successfully' });
  }
}
