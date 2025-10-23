import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response, Request } from 'express'
import { MongooseErrorResponse } from './ErrorResponse.type';
import { parseMongoDuplicateError } from 'src/common/utils/mongo-error.util';
import { MongooseError } from 'mongoose';
import { time } from 'console';

@Catch(MongoServerError, MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError | MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: MongooseErrorResponse

    if (exception instanceof MongoServerError && exception.code === 11000){
      errorResponse = parseMongoDuplicateError(exception)
    } else {
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Database Error',
        timestamp: new Date().toISOString(),
      }
    }

    response.status(errorResponse.statusCode).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
    })
  }
}
