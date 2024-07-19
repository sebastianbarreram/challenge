import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBService } from './mongodb.service';
import { getModelToken } from '@nestjs/mongoose';

const delayNotificationRegister = {
  email: 'test@example.com',
  latitude: '123.456',
  longitude: '456.789',
  forecast_code: 1186,
  forecast_description: 'Partly cloudy',
};
class DelayNotificationModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockReturnValue([delayNotificationRegister]),
  });
}

describe('MongoDBService', () => {
  let service: MongoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDBService,
        {
          provide: getModelToken('DelayNotification'),
          useValue: DelayNotificationModel,
        },
      ],
    }).compile();

    service = module.get<MongoDBService>(MongoDBService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDelayNotification', () => {
    const mockDelayNotification = {
      email: 'test@example.com',
      latitude: '123.456',
      longitude: '456.789',
      forecastCode: 1186,
      forecastDescription: 'Partly cloudy',
    };
    it('should create a new delay notification', async () => {
      const result = await service.createDelayNotification(
        mockDelayNotification.email,
        mockDelayNotification.latitude,
        mockDelayNotification.longitude,
        {
          forecast_code: mockDelayNotification.forecastCode,
          forecast_description: mockDelayNotification.forecastDescription,
          buyer_notification: false,
        },
      );

      expect(result).toEqual(mockDelayNotification);
    });
  });

  describe('getDelayNotificationsByEmail', () => {
    it('should find delay notifications by email', async () => {
      const email = 'test@example.com';
      const mockDelayNotifications = [
        {
          email: 'test@example.com',
          latitude: '123.456',
          longitude: '456.789',
          forecast_code: 1186,
          forecast_description: 'Partly cloudy',
        },
      ];

      const result = await service.getDelayNotificationsByEmail(email);

      expect(result).toEqual(mockDelayNotifications);
    });
  });
});
