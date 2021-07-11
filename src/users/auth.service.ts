import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpUserDto } from './dtos/sign-up-user.dto';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async singUp(signUpUserDto: SignUpUserDto) {
    const { email, password } = signUpUserDto;
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email is used');
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const hashedPassword = salt + '.' + hash.toString('hex');

    signUpUserDto.password = hashedPassword;
    const user = this.usersService.create(signUpUserDto);
    return user;
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    const users = await this.usersService.find(email);

    if (!users.length) {
      throw new NotFoundException('user not found');
    }

    const user = users[0];

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong email or password');
    }

    return user;
  }
}
