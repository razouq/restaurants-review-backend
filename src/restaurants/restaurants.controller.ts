import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../users/user.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Roles(Role.Admin)
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

  @Public()
  @Get()
  async list() {
    return this.restaurantsService.list();
  }
}
