import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

export const getErrorMessage = <T extends Error>(error: T): string => {
  if (error instanceof HttpException) {
    return error.message;
  }
  return String(error);
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errResponse = exception.getResponse();
    const message =
      typeof errResponse === 'string' ? errResponse : errResponse['message'];

    response.status(status).json({
      statusCode: status,
      message,
      data: {},
    });
  }
}
