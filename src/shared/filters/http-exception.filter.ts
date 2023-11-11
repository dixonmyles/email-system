import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Returns the error message from an HttpException or a generic error.
 * @param error - The error to get the message from.
 * @returns The error message.
 */
export const getErrorMessage = <T extends Error>(error: T): string => {
  if (error instanceof HttpException) {
    return error.message;
  }
  return String(error);
};

/**
 * A filter that catches HttpExceptions and returns a JSON response with the error message and status code.
 * @catches HttpException - The type of exception to catch.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  /**
   * Catches an HttpException and returns a JSON response with the error message and status code.
   * @param exception - The HttpException to catch.
   * @param host - The ArgumentsHost object.
   */
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
