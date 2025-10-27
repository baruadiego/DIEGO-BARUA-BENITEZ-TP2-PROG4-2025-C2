import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  count?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
  data?: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((result: any) => {
        const statusCode = response.statusCode ?? 200;

        const data = result?.data;

        const message = result?.message ?? 'Success';

        const formattedResponse: ApiResponse<T> = {
          statusCode,
          success: true,
          message,
          count: Array.isArray(data) ? data.length : undefined,
          page: result?.page,
          totalPages: result?.total,
          limit: result?.limit,
          data,
          timestamp: new Date().toISOString(),
        };

        return formattedResponse;
      }),
    );
  }
}
