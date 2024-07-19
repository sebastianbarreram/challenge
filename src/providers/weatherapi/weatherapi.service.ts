import { Injectable } from '@nestjs/common';
import {
  WEATHER_API_KEY,
  WEATHER_API_BASE_URL,
} from './constants/weatherapi.constants';

@Injectable()
export class WeatherApiService {
  async httpGet(url: string) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} - Error: ${JSON.stringify(
            data.error,
          )}`,
        );
      }
      return data;
    } catch (error) {
      throw new Error(`Fetch error: ${error.message}`);
    }
  }
  async getWeatherForecast(latitude: string, longitude: string) {
    try {
      const url = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=2&aqi=no&alerts=no&lang=es`;
      const weatherForecast = await this.httpGet(url);
      return weatherForecast;
    } catch (error) {
      throw error;
    }
  }
}
