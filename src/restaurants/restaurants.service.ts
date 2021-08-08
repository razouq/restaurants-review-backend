import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, currentUser: User) {
    console.log(currentUser);
    const restaurant = this.restaurantsRepository.create(createRestaurantDto);
    console.log(currentUser);
    restaurant.user = currentUser;
    return await this.restaurantsRepository.save(restaurant);
  }
}
