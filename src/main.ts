import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JsonOnlyGuard } from "./interface/shared/http/guards/json-only.guard";
import { AllExceptionsFilter } from "./interface/shared/http/filters/exceptions.filter";
import { TransformResponseInterceptor } from "./interface/shared/http/interceptors/transform-response.interceptor";

async function bootstrap() {
  const inProduction = process.env.NODE_ENV === "production";
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: inProduction,
    }),
  );

  app.useGlobalGuards(new JsonOnlyGuard());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("API_PORT") || 3000;

  await app.listen(port);
}
bootstrap();
