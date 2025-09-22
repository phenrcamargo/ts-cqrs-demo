import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreNotFoundError extends HttpException {
  constructor(storeId: string) {
    super(`Store with ID ${storeId} not found.`, HttpStatus.NOT_FOUND);
    this.name = "StoreNotFoundError";
  }
}
