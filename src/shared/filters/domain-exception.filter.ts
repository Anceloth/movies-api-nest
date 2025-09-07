import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainValidationException } from '../../domain/exceptions/domain-validation.exception';

@Catch(DomainValidationException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Domain validation failed',
      validationErrors: exception.validationErrors,
    };

    // Log the error
    console.error('Domain Validation Exception:', errorResponse);

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
