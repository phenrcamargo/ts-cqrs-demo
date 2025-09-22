import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "src/domain/shared/errors/domain.error";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let classValidatorMessage: { error: string; errors: any[] } | undefined;

    if (exception instanceof DomainError) {
      status = exception.statusCode;
      message = exception.message;

      response.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (status === HttpStatus.BAD_REQUEST && Array.isArray(res["message"])) {
        classValidatorMessage = {
          error: "Validation failed",
          errors: res["message"],
        };
      } else {
        message = (res["message"] || exception.message) as string;
      }

      response.status(status).json({
        statusCode: status,
        message: classValidatorMessage || message,
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }
}
