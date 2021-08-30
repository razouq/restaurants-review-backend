import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Public } from 'src/decorators/public.decorator';
import { User } from '../users/user.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant, RestaurantDocument } from './restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, currentUser: User) {
    const restaurant = new this.restaurantModel(createRestaurantDto);
    // restaurant.user = currentUser;
    return await restaurant.save();
  }

  async list() {
    return await this.restaurantModel.find({});
  }
}
