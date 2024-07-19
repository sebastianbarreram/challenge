import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './config/env/env.config';
import configuration from './config/service-configuration';
import { MongoDBModule } from './db/mongodb/mongodb.module';
import { EmailModule } from './providers/email/email.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { WeatherApiModule } from './providers/weatherapi/weatherapi.module';

@Module({
  imports: [
    DeliveryModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[configuration().service.node_env] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // service
        NODE_ENV: Joi.string().required(),
        SERVICE_NAME: Joi.string().required(),
        CHALLENGE_SERVICE_PORT: Joi.string().required(),
        // weather api
        WEATHER_API_BASE_URL: Joi.string().required(),
        WEATHER_API_KEY: Joi.string().required(),
        // email
        GMAIL_USERNAME: Joi.string().required(),
        GMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [WeatherApiModule, EmailModule, MongoDBModule],
})
export class AppModule {}
