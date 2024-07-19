// call initially to setup app env vars
import './config/env/env.config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger-configuration';
import serviceConfiguration from './config/service-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs/api', app, document, {
    swaggerUiEnabled: true,
  });
  await app.listen(serviceConfiguration().service.port || 3000);
}
bootstrap();
