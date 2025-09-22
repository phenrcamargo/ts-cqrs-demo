import { Command } from "@nestjs/cqrs";

export default class DeleteCompanyCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
