import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: [process.env.CLIENT_URL], credentials: true });
  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Job API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Enter token in format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      // This name here is important for matching up with @ApiBearerAuth() in your controller!
      'token',
    ).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, { swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' } });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
