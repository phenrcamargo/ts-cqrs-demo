import { HttpException, HttpStatus } from "@nestjs/common";

export class StoresByChainNotFoundError extends HttpException {
  constructor(chainId: string) {
    super(
      `No stores found for chain with ID: ${chainId}.`,
      HttpStatus.NOT_FOUND,
    );
    this.name = "StoresByChainNotFoundError";
  }
}
