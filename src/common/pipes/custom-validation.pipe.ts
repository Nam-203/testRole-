import { HttpStatus, Injectable, UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = errors.map((error) => {
          const constraintKeys = Object.keys(error.constraints || {});
          const relatedProperty = error.contexts?.[constraintKeys[0]]?.relatedProperty;

          return {
            field: error.property,
            message: this.translateErrors(error),
            relatedProperty
          };
        });

        throw new UnprocessableEntityException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Validation failed',
          errors: validationErrors
        });
      },
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    });
  }

  private translateErrors(error: ValidationError): string {
    if (error.constraints) {
      const constraintKeys = Object.keys(error.constraints);
      const translatedMessages = constraintKeys.map((key) => {
        return `validation.${key}`;
      });
      return translatedMessages.join(', ');
    }
    return 'Validation error';
  }
}
