import { Injectable, Logger } from '@nestjs/common';
import { MongoDBService } from '../../db/mongodb/mongodb.service';
import { EmailService } from '../../providers/email/email.service';
import { forecastNotificationCodes } from './constants/delivery.constants';
import { DelayNotificationHandlerResponse } from './dtos/WeatherForecastResponse.dto';
import { WeatherApiService } from '../../providers/weatherapi/weatherapi.service';
import { DelayNotification } from '../../db/mongodb/schemas/delaynotification.schema';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly weatherApiService: WeatherApiService,
    private readonly emailService: EmailService,
    private readonly mongoDBService: MongoDBService,
  ) {}

  private readonly logger = new Logger(DeliveryService.name);

  async getWeatherForecast(latitude: string, longitude: string): Promise<any> {
    try {
      this.logger.log(
        `Fetching weather forecast for latitude: ${latitude}, longitude: ${longitude}`,
      );
      const weatherForecast = await this.weatherApiService.getWeatherForecast(
        latitude,
        longitude,
      );
      this.logger.log(
        `Weather forecast fetched successfully for location: ${JSON.stringify(
          weatherForecast.location,
        )}`,
      );
      return weatherForecast;
    } catch (error) {
      throw error;
    }
  }
  async delayNotification(
    email: string,
    latitude: string,
    longitude: string,
  ): Promise<DelayNotificationHandlerResponse> {
    try {
      const weatherForecast = await this.getWeatherForecast(
        latitude,
        longitude,
      );
      const forecastNextDay = weatherForecast.forecast.forecastday[1];
      const forecastNextDayCode = forecastNextDay.day.condition.code;
      const forecastNextDayText = forecastNextDay.day.condition.text;
      const buyerNotification =
        forecastNotificationCodes.includes(forecastNextDayCode);
      const response = {
        forecast_code: forecastNextDayCode,
        forecast_description: forecastNextDayText,
        buyer_notification: buyerNotification,
      };
      if (buyerNotification == true) {
        const notificationText = `Hola! Tenemos programada la entrega de tu paquete para mañana, en la dirección de entrega esperamos un día con ${forecastNextDayText.toLowerCase()} y por esta razón es posible que tengamos retrasos. Haremos todo a nuestro alcance para cumplir con tu entrega.`;
        await this.sendEmail(email, notificationText);
        await this.mongoDBService.createDelayNotification(
          email,
          latitude,
          longitude,
          response,
        );
        this.logger.log(notificationText);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
  async sendEmail(email: string, notificationText: string): Promise<void> {
    try {
      await this.emailService.sendEmail(email, notificationText);
    } catch (error) {
      throw error;
    }
  }
  async getDelayNotificationsByEmail(
    email: string,
  ): Promise<DelayNotification[]> {
    try {
      const delayNotifications =
        await this.mongoDBService.getDelayNotificationsByEmail(email);
      return delayNotifications;
    } catch (error) {
      throw error;
    }
  }
}
