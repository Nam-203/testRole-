import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException
} from '@nestjs/common';
import { Response } from 'express';

import { ApiError } from '@/common/classes/api-error.class';

@Injectable()
@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let apiError: ApiError<any>;

    if (exception instanceof HttpException) {
      if (exception instanceof UnprocessableEntityException) {
        const exceptionResponse = exception.getResponse();

        const translatedErrors = exceptionResponse['errors'].map((err: any) => {
          return {
            field: err.field,
            message: err.message
          };
        });

        apiError = new ApiError({
          message: 'Validation failed',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          data: { errors: translatedErrors }
        });
      } else {
        apiError = new ApiError(exception);
      }
    } else {
      apiError = new ApiError({
        message: 'common.error.internal_server_error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });

      console.error(exception);
    }

    return response.status(apiError.statusCode).json(apiError.getResponse());
  }
}
