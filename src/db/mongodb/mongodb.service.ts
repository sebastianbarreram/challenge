import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DelayNotification } from './schemas/delaynotification.schema';
import { DelayNotificationHandlerResponse } from '../../modules/delivery/dtos/WeatherForecastResponse.dto';

@Injectable()
export class MongoDBService {
  constructor(
    @InjectModel(DelayNotification.name)
    private delayNotificationModel: Model<DelayNotification>,
  ) {}

  private readonly logger = new Logger(MongoDBService.name);

  async createDelayNotification(
    email: string,
    latitude: string,
    longitude: string,
    weatherForecast: DelayNotificationHandlerResponse,
  ): Promise<DelayNotification> {
    try {
      this.logger.log(`Creating notification for ${email}`);
      const newDelayNotification = new this.delayNotificationModel({
        email,
        latitude,
        longitude,
        forecastCode: weatherForecast.forecast_code,
        forecastDescription: weatherForecast.forecast_description,
      });
      this.logger.log(`Notification created successfully`);
      return await newDelayNotification.save();
    } catch (error) {
      this.logger.error(
        `Error creating a new DelayNotification: ${error.message}`,
      );
      throw error;
    }
  }

  async getDelayNotificationsByEmail(
    email: string,
  ): Promise<DelayNotification[]> {
    try {
      return this.delayNotificationModel.find({ email }).exec();
    } catch (error) {
      this.logger.error(`Error fetching DelayNotification[]: ${error.message}`);
      throw error;
    }
  }
}
