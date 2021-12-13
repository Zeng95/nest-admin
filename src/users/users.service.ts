import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<UserEntity[] | undefined> {
    return await this.usersRepository.find();
  }

  async findOne(email: string): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne(email);
  }
}
