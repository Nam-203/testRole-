import { HttpException, HttpStatus } from '@nestjs/common';

import { TApiError, TEntityError } from '@/common/types/index.e';

export class ApiError<T> extends HttpException {
  data?: T & { errors?: TEntityError[] };
  statusCode: HttpStatus;
  message: string;

  constructor(exception: HttpException | TApiError<T>) {
    let statusCode: HttpStatus;
    let message: string;
    let data: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response: string | Record<string, any> = exception.getResponse();

      if (typeof response === 'object') {
        // omit message and statusCode from data, and assign the rest keys to data object
        const { message: responseMessage, ...otherKeys } = response;
        message = responseMessage || message;
        if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
          data = { ...otherKeys };
        }
      }
    } else {
      statusCode = exception.statusCode;
      message = exception.message;
      data = exception.data;
    }

    if (data && Object.keys(data).length === 0 && data.constructor === Object) {
      data = undefined;
    }

    super({ statusCode, message, data }, statusCode);
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }

  addFieldError({ field, message }: TEntityError) {
    if (!this.data) {
      this.data = {} as T;
    }

    if (!this.data.errors) {
      this.data.errors = [];
    }
    this.data.errors.push({ field, message });
  }
}
