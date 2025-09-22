import { HttpException, HttpStatus } from "@nestjs/common";

export class ChainNotFoundError extends HttpException {
  constructor(chainId: string) {
    super(`Chain with ID ${chainId} not found.`, HttpStatus.NOT_FOUND);
    this.name = "ChainNotFoundError";
  }
}
