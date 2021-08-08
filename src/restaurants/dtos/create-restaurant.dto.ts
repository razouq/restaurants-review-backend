import { IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}
