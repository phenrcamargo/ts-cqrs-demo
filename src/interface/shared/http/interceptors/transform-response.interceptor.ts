import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable, map } from "rxjs";
import { DefaultResponseDTO } from "../dto/output/default-response.dto";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        const statusCode = response.statusCode || HttpStatus.OK;

        return new DefaultResponseDTO(statusCode, data);
      }),
    );
  }
}
