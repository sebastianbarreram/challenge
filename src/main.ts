// call initially to setup app env vars
import './config/env/env.config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger-configuration';
import serviceConfiguration from './config/service-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
    operationIdFactory: (_, methodName) => {
      return methodName;
    },
  });
  SwaggerModule.setup('docs/api', app, document, {
    customSiteTitle: 'Swagger UI',
    customCss: `
    .swagger-ui .topbar { background-color: #08083B; }
    .swagger-ui .sidebar { background-color: #EE2D41; }
    .swagger-ui a { color: #EE2D41; }
    .swagger-ui .try-out__btn { background-color: #EE2D41; border-color: #EE2D41; color: #fff; }
    .swagger-ui .btn.execute { background-color: #F5BD41; border-color: #F5BD41; color: #fff; }
    .swagger-ui .btn.cancel { background-color: #EE2D41; border-color: #EE2D41; color: #fff; }
    .swagger-ui .swagger-ui { background-color: #F8F8FC; }
    .swagger-ui .topbar-wrapper max-height: 800px; }
  `,
  });

  await app.listen(serviceConfiguration().service.port || 3000);
}
bootstrap();
