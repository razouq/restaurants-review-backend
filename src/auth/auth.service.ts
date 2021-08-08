import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const users = await this.usersService.findUsersByEmail(email);

    if (!users.length) {
      return null;
    }

    const user = users[0];

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const { id: id, email, role } = user;
    const payload = { email, id, role };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  async register(email: string, password: string) {
    const users = await this.usersService.findUsersByEmail(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const resultPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, resultPassword);

    delete user.password;

    return user;
  }
}
