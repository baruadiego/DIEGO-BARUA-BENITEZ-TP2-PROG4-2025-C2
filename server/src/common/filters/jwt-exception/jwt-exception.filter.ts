import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

@Catch()
export class JwtExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 401;
    let message = 'Invalid token';

    if (exception instanceof TokenExpiredError) {
      message = 'Token expirado';
    } else if (exception instanceof NotBeforeError) {
      message = 'Token aún no válido';
    } else if (exception instanceof JsonWebTokenError){
      message = 'Token inválido';
    } 
    else {
      message = (exception as any).message || 'Unauthorized';
    }

    response.status(status).json({
      statusCode: status,
      error: 'Unauthorized',
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
