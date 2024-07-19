import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { WeatherApiService } from '../../providers/weatherapi/weatherapi.service';
import { EmailService } from '../../providers/email/email.service';
import { MongoDBService } from '../../db/mongodb/mongodb.service';
import { getModelToken } from '@nestjs/mongoose';
import { DelayNotification } from 'src/db/mongodb/schemas/delaynotification.schema';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let spyWeatherApiService: WeatherApiService;
  let spyEmailService: EmailService;
  let spyMongoDBService: MongoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        WeatherApiService,
        EmailService,
        MongoDBService,
        {
          provide: getModelToken('DelayNotification'),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    spyWeatherApiService = module.get<WeatherApiService>(WeatherApiService);
    spyEmailService = module.get<EmailService>(EmailService);
    spyMongoDBService = module.get<MongoDBService>(MongoDBService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherForecast', () => {
    const latitude = '123';
    const longitude = '456';
    it('should fetch weather forecast successfully', async () => {
      const mockWeatherForecast = {
        forecast: {
          forecastday: [{ day: { condition: { code: 800, text: 'Clear' } } }],
        },
      };

      jest
        .spyOn(spyWeatherApiService, 'getWeatherForecast')
        .mockResolvedValueOnce(mockWeatherForecast);

      const result = await service.getWeatherForecast(latitude, longitude);

      expect(result).toEqual(mockWeatherForecast);
    });

    it('should throw an error when weather forecast fails', async () => {
      const mockError = new Error('Weather forecast error');

      jest
        .spyOn(spyWeatherApiService, 'getWeatherForecast')
        .mockRejectedValueOnce(mockError);

      await expect(
        service.getWeatherForecast(latitude, longitude),
      ).rejects.toThrow(mockError);
    });
  });

  describe('delayNotification', () => {
    const mockDelayNotification: DelayNotification = {
      email: 'test@example.com',
      latitude: '123.456',
      longitude: '456.789',
      forecastCode: 1186,
      forecastDescription: 'Partly cloudy',
      createdAt: new Date('2024-07-17T05:43:17.268Z'),
    };
    const email = 'test@example.com';
    const latitude = '123';
    const longitude = '456';
    it('should send delay notification email and create MongoDB entry', async () => {
      const mockWeatherForecast = {
        forecast: {
          forecastday: [
            { day: { condition: { code: 100, text: 'Cloudy' } } },
            { day: { condition: { code: 1189, text: 'Rain' } } },
          ],
        },
      };

      jest
        .spyOn(service, 'getWeatherForecast')
        .mockResolvedValueOnce(mockWeatherForecast);
      jest.spyOn(spyEmailService, 'sendEmail').mockResolvedValueOnce();

      jest
        .spyOn(spyMongoDBService, 'createDelayNotification')
        .mockResolvedValueOnce(mockDelayNotification);

      const result = await service.delayNotification(
        email,
        latitude,
        longitude,
      );

      expect(result.forecast_code).toEqual(1189);
      expect(result.forecast_description).toEqual('Rain');
      expect(result.buyer_notification).toBeTruthy();

      expect(spyEmailService.sendEmail).toHaveBeenCalled();
      expect(spyMongoDBService.createDelayNotification).toHaveBeenCalledWith(
        email,
        latitude,
        longitude,
        result,
      );
    });

    it('should not send delay notification email for clear weather', async () => {
      const mockWeatherForecast = {
        forecast: {
          forecastday: [
            { day: { condition: { code: 100, text: 'Cloudy' } } },
            { day: { condition: { code: 800, text: 'Clear' } } },
          ],
        },
      };

      jest
        .spyOn(service, 'getWeatherForecast')
        .mockResolvedValueOnce(mockWeatherForecast);
      jest.spyOn(spyEmailService, 'sendEmail').mockResolvedValue();
      jest
        .spyOn(spyMongoDBService, 'createDelayNotification')
        .mockResolvedValueOnce(mockDelayNotification);

      const result = await service.delayNotification(
        email,
        latitude,
        longitude,
      );

      expect(result.forecast_code).toEqual(800);
      expect(result.forecast_description).toEqual('Clear');
      expect(result.buyer_notification).toBeFalsy();

      expect(spyEmailService.sendEmail).not.toHaveBeenCalled();
      expect(spyMongoDBService.createDelayNotification).not.toHaveBeenCalled();
    });

    it('should throw an error when getWeatherForecast fails', async () => {
      const mockError = new Error('Weather forecast error');

      jest.spyOn(service, 'getWeatherForecast').mockRejectedValue(mockError);

      await expect(
        service.delayNotification(email, latitude, longitude),
      ).rejects.toThrow(mockError);
    });
  });

  describe('sendEmail', () => {
    const email = 'test@example.com';
    const notificationText = 'Test email notification';
    it('should send email successfully', async () => {
      jest.spyOn(spyEmailService, 'sendEmail').mockResolvedValue();

      await service.sendEmail(email, notificationText);

      expect(spyEmailService.sendEmail).toHaveBeenCalledWith(
        email,
        notificationText,
      );
    });

    it('should throw an error when sendEmail fails', async () => {
      const mockError = new Error('Send email error');

      jest.spyOn(spyEmailService, 'sendEmail').mockRejectedValue(mockError);

      await expect(service.sendEmail(email, notificationText)).rejects.toThrow(
        mockError,
      );
    });
  });
});
