import { getModelToken } from '@nestjs/mongoose';
import { DeliveryService } from './delivery.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { MongoDBService } from '../../db/mongodb/mongodb.service';
import { EmailService } from '../../providers/email/email.service';
import { WeatherApiService } from '../../providers/weatherapi/weatherapi.service';
import { DelayNotification } from '../../db/mongodb/schemas/delaynotification.schema';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let service: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
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

    controller = module.get<DeliveryController>(DeliveryController);
    service = module.get<DeliveryService>(DeliveryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delayNotificationHandler', () => {
    const email = 'test@example.com';
    const latitude = '123.456';
    const longitude = '456.789';
    it('should handle delay notification successfully', async () => {
      const result = {
        forecast_code: 1,
        forecast_description: 'test',
        buyer_notification: false,
      };

      jest.spyOn(service, 'delayNotification').mockResolvedValue(result);

      const response = await controller.delayNotificationHandler(
        email,
        latitude,
        longitude,
      );

      expect(response).toEqual(result);
      expect(service.delayNotification).toHaveBeenCalledWith(
        email,
        latitude,
        longitude,
      );
    });

    it('should handle general exceptions', async () => {
      jest
        .spyOn(service, 'delayNotification')
        .mockRejectedValue(new Error('Test error'));

      try {
        await controller.delayNotificationHandler(email, latitude, longitude);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('getDelayNotificationsByEmail', () => {
    const email = 'test@example.com';
    it('should fetch delay notifications by email successfully', async () => {
      const mockNotifications: DelayNotification[] = [
        {
          email: 'testuser@gmail.com',
          latitude: '12.54',
          longitude: '-75.65',
          forecastCode: 12,
          forecastDescription: 'test',
          createdAt: new Date('2024-07-17T05:43:17.268Z'),
        },
      ];

      jest
        .spyOn(service, 'getDelayNotificationsByEmail')
        .mockResolvedValue(mockNotifications);

      const response = await controller.getDelayNotificationsByEmail(email);

      expect(response).toEqual(mockNotifications);
      expect(service.getDelayNotificationsByEmail).toHaveBeenCalledWith(email);
    });
    it('should log an error if fetching delay notifications fails', async () => {
      jest
        .spyOn(service, 'getDelayNotificationsByEmail')
        .mockRejectedValue(new Error('Test error'));

      try {
        await controller.getDelayNotificationsByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Test error');
      }
    });
  });
});
