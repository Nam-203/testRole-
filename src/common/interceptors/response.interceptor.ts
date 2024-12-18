import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { TApiResponse } from '../types/index.e';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, TApiResponse<T>> {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<TApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: TApiResponse<T> = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data?.message,
          data: data
        };

        if (data?.message && Object.keys(data).length === 1) {
          response.data = undefined;
        }

        if (data?.hasOwnProperty('data')) {
          response.data = data?.data;
        }

        if (data?.pagination) {
          response.pagination = data?.pagination;
        }

        return response;
      })
    );
  }
}
