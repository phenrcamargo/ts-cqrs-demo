import { HttpException, HttpStatus } from "@nestjs/common";

export class ChainHasStoresError extends HttpException {
  constructor(chainId: string) {
    super(
      `Chain with ID ${chainId} has associated stores and cannot be deleted.`,
      HttpStatus.CONFLICT,
    );
    this.name = "ChainHasStoresError";
  }
}
