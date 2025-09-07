import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers with Helmet
  app.use(helmet());

  // Set global API prefix
  app.setGlobalPrefix(configService.get('app.apiPrefix'));

  // Enable CORS
  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    credentials: true,
  });

  // Enable API versioning (disabled)
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger configuration
  const swaggerConfig = configService.get('app.swagger');
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConfig.path, app, document);

  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${swaggerConfig.path}`,
  );
}

bootstrap();
