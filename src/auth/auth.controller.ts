import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.passwordConfirmed) {
      throw new BadRequestException('Passwords do not match!');
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
}
