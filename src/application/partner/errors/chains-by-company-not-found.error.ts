import { HttpException, HttpStatus } from "@nestjs/common";

export class ChainsByCompanyNotFoundError extends HttpException {
  constructor(companyId: string) {
    super(
      `No chains found for company with ID: ${companyId}`,
      HttpStatus.NOT_FOUND,
    );
    this.name = "ChainsByCompanyNotFoundError";
  }
}
