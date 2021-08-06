import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { SignUpUserDto } from './dtos/sign-up-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignUpUserDto): Promise<User> {
    const user = await this.authService.singUp(body);
    return user;
  }

  @Post('signin')
  async signin(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signIn(body);
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    return response.send({ message: 'success' });
  }

  @Get('me')
  async me() {
    return 'me';
  }
}
