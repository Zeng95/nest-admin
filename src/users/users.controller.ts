import { Controller, Get, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/shared/user.decorator';
import { User } from './models/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  async getUser(@Param('id') id: string, @ReqUser() user: any) {
    if (id !== user.id) {
      throw new NotFoundException('User id not correct');
    }

    const result = await this.usersService.findOneWithId(user.id);
    // * Removie Object Properties with Destructuring
    const { password, ...newUser } = result;
    return newUser;
  }
}
