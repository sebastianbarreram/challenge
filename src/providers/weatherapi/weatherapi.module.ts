import { Module } from '@nestjs/common';
import { WeatherApiService } from './weatherapi.service';

@Module({
  imports: [],
  providers: [WeatherApiService],
  exports: [WeatherApiService],
})
export class WeatherApiModule {}
