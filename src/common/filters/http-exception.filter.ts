import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../../generated/prisma'
import { LoggerService } from '../logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: string | null = null;

    // Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;

        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Unexpected database error';
          break;
      }
    }

    // NestJS HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    else if (exception instanceof Error) {
      details = exception.message;
    }

    this.logger.error({
      status,
      message,
      details,
      stack: (exception as Error)?.stack,
    });

    response.status(status).json({
      statusCode: status,
      message,
      ...(details && { details }),
    });
  }
}
