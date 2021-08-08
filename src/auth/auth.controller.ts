import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    return this.authService.register(email, password);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true });
    return res.json({ message: 'success' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  // admin route
  @Get('admin')
  @Roles(Role.Admin)
  admin() {
    return 'hi admin';
  }
}
