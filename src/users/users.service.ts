import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsersByEmail(email: string) {
    const result = await this.userModel.find({ email });
    return result;
  }

  async create(email: string, password: string) {
    const user = new this.userModel({ email, password, role: 'user' });
    return await user.save();
  }
}
