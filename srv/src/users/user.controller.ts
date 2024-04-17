import { UserService } from './users.service';
import { Controller, Get, Query } from '@nestjs/common';
import { UsersResponseDto } from "./users.response.dto";

@Controller('users')
export class UserController {

  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
    const { users, count } = await this.userService.findAll(page, limit);
    return {
      data: users.map(user => UsersResponseDto.fromUsersEntity(user)),
      count,
      page,
      limit,
    };
  }
}
