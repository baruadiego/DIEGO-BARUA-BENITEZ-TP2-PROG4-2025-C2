import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/filters/mongoose-exception/MongoExceptionFilter.filter';
import { httpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { JwtExceptionFilter } from './common/filters/jwt-exception/jwt-exception.filter';
import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new JwtExceptionFilter(), new MongoExceptionFilter(), new httpExceptionFilter());

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

  app.enableCors(
    {
      origin: process.env.CLIENT_URL,
      credentials: true,
    }
  );

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
