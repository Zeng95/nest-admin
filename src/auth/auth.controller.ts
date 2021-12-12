import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
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

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
