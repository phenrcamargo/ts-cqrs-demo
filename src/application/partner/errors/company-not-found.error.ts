import { HttpException, HttpStatus } from "@nestjs/common";

export class CompanyNotFoundError extends HttpException {
  constructor(companyId: string) {
    super(`Company with ID ${companyId} not found.`, HttpStatus.NOT_FOUND);
    this.name = "CompanyNotFoundError";
  }
}
