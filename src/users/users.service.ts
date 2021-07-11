import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.usersRepository.findOne(id);
  }

  find(email: string) {
    return this.usersRepository.find({ email });
  }

  create(signUpUserDto: SignInUserDto) {
    const { email, password } = signUpUserDto;
    const user = this.usersRepository.create({ email, password });

    return this.usersRepository.save(user);
  }
}
