import { HttpException, HttpStatus } from "@nestjs/common";

export class CompanyIsDisabled extends HttpException {
  constructor(companyId: string) {
    super(`Company with ID ${companyId} is disabled.`, HttpStatus.FORBIDDEN);
    this.name = "CompanyIsDisabledError";
  }
}
