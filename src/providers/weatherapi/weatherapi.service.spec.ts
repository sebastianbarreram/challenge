import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiService } from './weatherapi.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherApiService],
    }).compile();

    service = module.get<WeatherApiService>(WeatherApiService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('httpGet', () => {
    const url = 'http://example.com/data';
    const mockData = { description: 'Sunny' };
    it('should fetch data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;
      const spyFetch = jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(Promise.resolve(mockResponse));

      const data = await service.httpGet(url);

      expect(spyFetch).toHaveBeenCalledWith(url);
      expect(data).toEqual(mockData);
    });

    it('should throw an error on non-ok response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not Found' }),
      } as unknown as Response;

      jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(Promise.resolve(mockResponse));

      await expect(service.httpGet(url)).rejects.toThrow(
        `HTTP error! Status: ${mockResponse.status}`,
      );
    });

    it('should throw an error on fetch error', async () => {
      const mockError = new Error('error test in fetch');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

      await expect(service.httpGet(url)).rejects.toThrow(
        'Fetch error: error test in fetch',
      );
    });
  });

  describe('getWeatherForecast', () => {
    const latitude = '123';
    const longitude = '456';
    it('should fetch weather forecast successfully', async () => {
      const mockWeatherForecast = { forecast: 'Sunny' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockWeatherForecast),
      } as unknown as Response;
      const spyFetch = jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(Promise.resolve(mockResponse));

      const weatherForecast = await service.getWeatherForecast(
        latitude,
        longitude,
      );

      const expectedUrl = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}&days=2&aqi=no&alerts=no&lang=es`;
      expect(spyFetch).toHaveBeenCalledWith(expectedUrl);
      expect(weatherForecast).toEqual(mockWeatherForecast);
    });

    it('should throw an error on fetch error', async () => {
      const mockError = new Error('Fetch error');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

      await expect(
        service.getWeatherForecast(latitude, longitude),
      ).rejects.toThrow(`Fetch error: ${mockError.message}`);
    });
  });
});
