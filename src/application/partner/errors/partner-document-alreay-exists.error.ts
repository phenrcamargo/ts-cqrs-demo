import { HttpException, HttpStatus } from "@nestjs/common";

export class PartnerDocumentAlreadyExistsError extends HttpException {
  constructor(document: string) {
    super(
      `Partner with document ${document} already exists.`,
      HttpStatus.CONFLICT,
    );
    this.name = "PartnerDocumentAlreadyExistsError";
  }
}
