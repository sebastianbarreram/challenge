import { Module } from '@nestjs/common';
import {
  DelayNotification,
  DelayNotificationSchema,
} from './schemas/delaynotification.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBService } from './mongodb.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://dev_admin:secret1@challengemercadolibre.muao9lp.mongodb.net/?retryWrites=true&w=majority&appName=ChallengeMercadoLibre`,
    ),
    MongooseModule.forFeature([
      { name: DelayNotification.name, schema: DelayNotificationSchema },
    ]),
  ],
  providers: [MongoDBService],
  exports: [MongoDBService],
})
export class MongoDBModule {}
