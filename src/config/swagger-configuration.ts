import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Challenge')
  .setDescription(
    'This API alert Mercado Libre buyers about potential delivery delays due to weather conditions at their delivery location',
  )
  .setVersion('1.0')
  .build();
