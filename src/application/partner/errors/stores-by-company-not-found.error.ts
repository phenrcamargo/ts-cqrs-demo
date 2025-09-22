import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreByCompanyNotFoundError extends HttpException {
  constructor(companyId: string) {
    super(
      `No stores found for company with ID: ${companyId}.`,
      HttpStatus.NOT_FOUND,
    );
    this.name = "StoreByCompanyNotFoundError";
  }
}
