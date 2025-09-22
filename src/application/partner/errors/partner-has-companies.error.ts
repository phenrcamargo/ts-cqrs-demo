import { HttpException, HttpStatus } from "@nestjs/common";

export class PartnerHasCompaniesError extends HttpException {
  constructor(partnerId: string) {
    super(
      `Cannot delete partner with ID ${partnerId} because it is associated with existing companies.`,
      HttpStatus.CONFLICT,
    );
    this.name = "PartnerHasCompaniesError";
  }
}
