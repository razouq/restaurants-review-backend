import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dtos/sign-up-user.dto';
import { User } from './user.entity';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async singUp(signUpUserDto: SignUpUserDto) {
    const { email, password } = signUpUserDto;
    const users = await this.usersRepository.find({
      email,
    });

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
    const user = this.usersRepository.create(signUpUserDto);
    const result = await this.usersRepository.save(user);
    return result;
  }
}
