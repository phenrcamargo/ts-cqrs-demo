import { Command } from "@nestjs/cqrs";

export default class DeleteStoreCommand extends Command<void> {
  constructor(public readonly storeId: string) {
    super();
  }
}
