import { HttpException, HttpStatus } from "@nestjs/common";

export class PartnerIsDisabled extends HttpException {
  constructor(partnerId: string) {
    super(`Partner with ID ${partnerId} is disabled.`, HttpStatus.FORBIDDEN);
    this.name = "PartnerIsDisabledError";
  }
}
