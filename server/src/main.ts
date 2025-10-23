import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/filters/mongoose-exception/MongoExceptionFilter.filter';
import { HtppExceptionFilter } from './common/filters/htpp-exception/htpp-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new MongoExceptionFilter(), new HtppExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          if (err.constraints?.whitelistValidation) {
            return `El campo "${err.property}" no está permitido`;
          }
          return Object.values(err.constraints ?? {}).join(', ');
        });

        return new BadRequestException(messages);
      },
    }),
  );

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
