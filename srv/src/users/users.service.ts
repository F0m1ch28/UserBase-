import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 20): Promise<{ users: UsersEntity[], count: number }> {
    const [users, count] = await this.usersRepo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return { users, count };
  }
}
