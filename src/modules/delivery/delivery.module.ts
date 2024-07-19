import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { MongoDBModule } from '../../db/mongodb/mongodb.module';
import { EmailModule } from '../../providers/email/email.module';
import { WeatherApiModule } from '../../providers/weatherapi/weatherapi.module';

@Module({
  imports: [WeatherApiModule, EmailModule, MongoDBModule],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
