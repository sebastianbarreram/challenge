import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Logger, Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { QueryRequired } from '../../common/decorators/param.decorator';
import { DelayNotificationHandlerResponse } from './dtos/WeatherForecastResponse.dto';
import { DelayNotification } from '../../db/mongodb/schemas/delaynotification.schema';

@Controller('api/delivery')
@ApiTags('Delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  private readonly logger = new Logger(DeliveryController.name);

  @Get('delay-notification')
  @ApiOkResponse({
    description: 'Delay notification handled succesfully',
    type: DelayNotificationHandlerResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: "Missing required query param: 'longitude'",
        error: 'Bad Request',
      },
    },
  })
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'latitude', type: String })
  @ApiQuery({ name: 'longitude', type: String })
  async delayNotificationHandler(
    @QueryRequired('email') email: string,
    @QueryRequired('latitude') latitude: string,
    @QueryRequired('longitude') longitude: string,
  ): Promise<DelayNotificationHandlerResponse> {
    try {
      this.logger.log(
        `Init delayNotification for email: ${email}, latitude: ${latitude}, longitude: ${longitude}`,
      );

      const delayNotificationResponse =
        await this.deliveryService.delayNotification(
          email,
          latitude,
          longitude,
        );

      this.logger.log(
        `End delayNotification successfully: ${JSON.stringify(
          delayNotificationResponse,
        )}`,
      );

      return delayNotificationResponse;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('delay-notifications/:email')
  @ApiOkResponse({
    description: 'Fetch delay notifications by email succesfully',
    type: [DelayNotification],
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cannot GET /api/delivery/delay-notifications',
        error: 'Not Found',
      },
    },
  })
  async getDelayNotificationsByEmail(
    @Param('email') email: string,
  ): Promise<DelayNotification[]> {
    try {
      this.logger.log(`Init getDelayNotificationsByEmail for email: ${email}`);

      const delayNotifications =
        await this.deliveryService.getDelayNotificationsByEmail(email);

      this.logger.log('End getDelayNotificationsByEmail successfully');

      return delayNotifications;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
