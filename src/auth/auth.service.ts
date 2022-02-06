import { BadRequestException, Body, ConflictException, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { isEmail, isNumberString } from 'class-validator';
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

  async validateUserEmail(email: string, pass: string) {
    try {
      const user = await this.usersService.findOneWithEmail(email);

      if (user && user.password === pass) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateUserPhone(phone: string, pass: string) {
    try {
      const user = await this.usersService.findOneWithPhone(phone);

      if (user && user.password === pass) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateUserEmailOrPhone(username: string, pass: string) {
    try {
      if (isEmail(username)) {
        return await this.validateUserEmail(username.toLowerCase(), pass);
      } else if (isNumberString(username)) {
        return await this.validateUserPhone(username, pass);
      }

      throw Error('Invalid username type');
    } catch (error) {
      throw Error(error);
    }
  }

  async registerWithPhone(@Body() body: PhoneRegistrationDTO) {
    const { password, passwordConfirmed, firstName, lastName, phone, countryCode } = body;

    if (password !== passwordConfirmed) {
      throw new BadRequestException('Passwords do not match');
    }

    const isPhoneExisting = await this.usersService.findOneWithPhone(phone);

    if (isPhoneExisting) {
      throw new ConflictException('This phone number is already in use');
    }

    // Generate a salt and hash on separate function calls
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const payload = { firstName, lastName, phone, countryCode, password: hash };

    return this.usersService.create(payload);
  }

  async registerWithEmail(@Body() body: EmailRegistrationDTO) {
    const { password, passwordConfirmed, firstName, lastName, email } = body;

    if (password !== passwordConfirmed) {
      throw new BadRequestException('Passwords do not match');
    }

    const isEmailExisting = await this.usersService.findOneWithEmail(email);

    if (isEmailExisting) {
      throw new ConflictException('This email is already in use');
    }

    // Generate a salt and hash on separate function calls
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const payload = { firstName, lastName, email, password: hash };

    return this.usersService.create(payload);
  }

  async logout(@Res() response: Response) {
    response.clearCookie('jwt');
    response.status(200).send({ message: 'Logout successfully' });
  }
}
