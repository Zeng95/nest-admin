import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { isEmail, isPhoneNumber } from 'class-validator';
import { User } from 'src/users/models/user.entity';
import { UsersService } from '../users/users.service';
import { EmailRegistrationDTO, PhoneRegistrationDTO } from './models/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  generateToken(payload: { sub: string; name: string }): string {
    return this.jwtService.sign(payload);
  }

  async validateUserEmail(email: string, pass: string) {
    const result = await this.usersService.findOneWithEmail(email);

    if (!result) {
      throw new NotFoundException('User not found');
    }

    if (result && !(await bcrypt.compare(pass, result.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // * Removie Object Properties with Destructuring
    const { password, ...user } = result;
    return user;
  }

  async validateUserPhone(phone: string, pass: string) {
    const result = await this.usersService.findOneWithPhone(phone);

    if (!result) {
      throw new NotFoundException('User not found');
    }

    if (result && !(await bcrypt.compare(pass, result.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // * Removie Object Properties with Destructuring
    const { password, ...user } = result;
    return user;
  }

  async validateUserEmailOrPhone(username: string, pass: string) {
    if (isEmail(username)) {
      return await this.validateUserEmail(username.toLowerCase(), pass);
    }

    if (isPhoneNumber(username)) {
      return await this.validateUserPhone(username, pass);
    }

    throw new UnprocessableEntityException('Invalid username type');
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

    // * Generate a salt and hash on separate function calls
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

    // * Generate a salt and hash on separate function calls
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const payload = { firstName, lastName, email, password: hash };

    return this.usersService.create(payload);
  }

  login(user: User) {
    // * {
    // *   "sub": "1234567890",
    // *   "name": "John Doe",
    // *   "admin": true
    // * }
    // * Generate our JWT token from a subset of the user object properties
    // * We choose a property name of sub to hold our userId value to be consistent with JWT standards
    const payload = {
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`
    };

    return this.generateToken(payload);
  }
}
