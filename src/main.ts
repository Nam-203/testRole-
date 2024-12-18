import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { corsConfig } from './common/config/cors.config';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: corsConfig.origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type, Accept, Authorization, Accept-Time-Zone, Accept-Language'],
    credentials: true
  });

  // Add global interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), app.get(ApiResponseInterceptor));

  // Add global pipes

  // Add global guards
  app.useGlobalGuards(app.get(JwtGuard));

  // Add global filters

  // Add Swagger
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_SITE_TITLE'))
    .setDescription(configService.get<string>('SWAGGER_DOC_DESCRIPTION'))
    .setVersion(configService.get<string>('SWAGGER_DOC_VERSION'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(5001);
}
bootstrap();
