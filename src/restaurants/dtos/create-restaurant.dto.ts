import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsArray()
  images: string[];
}
