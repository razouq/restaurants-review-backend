import { Body, Controller, Post, Session } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SignUpUserDto } from './dtos/sign-up-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signUp(
    @Body() body: SignUpUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.usersService.singUp(body);
    console.log(session);
    session.userId = user.id;
    return user;
  }
}
