import { HttpException, HttpStatus } from "@nestjs/common";

export class CompanyHasChainsError extends HttpException {
  constructor(companyId: string) {
    super(
      `Company with ID ${companyId} has associated chains and cannot be deleted.`,
      HttpStatus.CONFLICT,
    );
    this.name = "CompanyHasChainsError";
  }
}
