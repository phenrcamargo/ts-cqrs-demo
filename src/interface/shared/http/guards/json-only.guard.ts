import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from "@nestjs/common";

@Injectable()
export class JsonOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method === "GET" || request.method === "DELETE") {
      // Allow GET and DELETE requests without checking Content-Type
      return true;
    }

    const contentType = (request.headers["content-type"] || "") as string;

    if (!contentType.includes("application/json")) {
      throw new UnsupportedMediaTypeException(
        "Content-Type must be application/json",
      );
    }

    return true;
  }
}
