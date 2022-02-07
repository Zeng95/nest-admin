import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[] | undefined> {
    return this.usersRepository.find();
  }

  findOneWithId(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  findOneWithEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findOneWithPhone(phone: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { phone } });
  }
}
