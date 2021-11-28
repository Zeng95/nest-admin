import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body) {
    const saltOrRounds = 12;
    const password = body.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return this.usersService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hash
    });
  }
}
