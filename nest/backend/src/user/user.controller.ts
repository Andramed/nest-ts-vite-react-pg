import { Controller, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor(''))
  async createUser(@Body() createUserData: CreateUserDto): Promise<User> {
    console.log(createUserData);

    return this.userService.addUser(createUserData);
  }

    @Get()
    async getAllUser() {
      console.log("Get all users");
      
        return await this.userService.findAll()
    }

}
