import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/shared/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  async getUser(@Param('id') id: string, @ReqUser() user: any): Promise<User> {
    if (id !== user.id) {
      throw new NotFoundException('User id not correct');
    }

    const result = await this.usersService.findOneWithId(user.id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    await this.usersService.update(id, body);
    return await this.usersService.findOneWithId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
