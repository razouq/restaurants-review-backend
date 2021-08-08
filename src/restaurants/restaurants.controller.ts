import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.restaurantsService.create(
      createRestaurantDto,
      currentUser,
    );
  }
}
