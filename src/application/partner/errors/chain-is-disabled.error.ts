import { HttpException, HttpStatus } from "@nestjs/common";

export class ChainIsDisabled extends HttpException {
  constructor(chainId: string) {
    super(`Chain with ID ${chainId} is disabled.`, HttpStatus.FORBIDDEN);
    this.name = "ChainIsDisabledError";
  }
}
