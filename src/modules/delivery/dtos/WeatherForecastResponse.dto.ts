import { ApiProperty } from '@nestjs/swagger';

export class DelayNotificationHandlerResponse {
  @ApiProperty({
    example: 1063,
    description: 'The weather forecast code',
  })
  forecast_code: number;

  @ApiProperty({
    example: 'Lluvia  moderada a intervalos',
    description: 'The weather forecast text',
  })
  forecast_description: string;

  @ApiProperty({
    example: false,
    description: 'The buyer notification email has been sent',
  })
  buyer_notification: boolean;
}
