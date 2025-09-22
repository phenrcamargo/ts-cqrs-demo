import { HttpException, HttpStatus } from "@nestjs/common";

export class PartnerNotFoundError extends HttpException {
  constructor(partnerId: string) {
    super(`Partner with ID ${partnerId} not found.`, HttpStatus.NOT_FOUND);
    this.name = "PartnerNotFoundError";
  }
}
