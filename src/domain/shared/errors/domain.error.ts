import { HttpStatus } from "@nestjs/common";

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
  }
}

export class DomainValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
