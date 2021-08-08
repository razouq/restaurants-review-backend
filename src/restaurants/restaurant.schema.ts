import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
