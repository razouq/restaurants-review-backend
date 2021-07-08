import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { SignUpUserDto } from './dtos/sign-up-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  hello() {
    return 'hello';
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() currentUser: User) {
    console.log(currentUser);
    return currentUser;
  }

  @Post('signup')
  async signUp(
    @Body() body: SignUpUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.usersService.singUp(body);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: SignInUserDto, @Session() session: any) {
    const user = await this.usersService.signIn(body);
    session.userID = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
