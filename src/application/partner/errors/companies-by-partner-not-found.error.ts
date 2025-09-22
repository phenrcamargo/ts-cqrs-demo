import { HttpException, HttpStatus } from "@nestjs/common";

export class CompaniesByPartnerNotFoundError extends HttpException {
  constructor(partnerId: string) {
    super(
      `No companies found for partner with ID: ${partnerId}.`,
      HttpStatus.NOT_FOUND,
    );
    this.name = "CompaniesByPartnerNotFoundError";
  }
}
