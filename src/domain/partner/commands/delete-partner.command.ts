import { Command } from "@nestjs/cqrs";

export default class DeletePartnerCommand extends Command<void> {
  constructor(public readonly partnerId: string) {
    super();
  }
}
