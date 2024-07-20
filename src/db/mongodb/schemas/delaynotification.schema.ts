import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

export type DelayNotificationDocument = HydratedDocument<DelayNotification>;

@Schema()
@Injectable()
export class DelayNotification {
  @Prop({ required: true })
  @ApiProperty({
    example: 'testuser@gmail.com',
    description: 'The user email',
  })
  email: string;

  @Prop({ required: true })
  @ApiProperty({
    example: '6.1543519',
    description: 'Latitude of the delivery location',
  })
  latitude: string;

  @Prop({ required: true })
  @ApiProperty({
    example: '-75.6076758',
    description: 'Longitude of the delivery location',
  })
  longitude: string;

  @Prop({ required: true })
  @ApiProperty({
    example: 1189,
    description: 'The weather forecast code of the delivery location',
  })
  forecastCode: number;

  @Prop({ required: true })
  @ApiProperty({
    example: 'Lluvia moderada',
    description: 'The weather forecast text of the delivery location',
  })
  forecastDescription: string;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({
    example: '2024-07-17T05:43:17.268Z',
    description: 'Creation date of the delay notification',
  })
  createdAt: Date;
}

export const DelayNotificationSchema =
  SchemaFactory.createForClass(DelayNotification);
