import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreDocumentAlreadyExistsError extends HttpException {
  constructor(document: string) {
    super(
      `Store with document ${document} already exists.`,
      HttpStatus.CONFLICT,
    );
    this.name = "StoreDocumentAlreadyExistsError";
  }
}
