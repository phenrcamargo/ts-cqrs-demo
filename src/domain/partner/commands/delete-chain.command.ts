import { Command } from "@nestjs/cqrs";

export default class DeleteChainCommand extends Command<void> {
  constructor(public readonly chainId: string) {
    super();
  }
}
