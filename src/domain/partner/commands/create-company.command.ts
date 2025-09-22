import { Command } from "@nestjs/cqrs";

export default class CreateCompanyCommand extends Command<string> {
  constructor(
    public readonly partnerId: string,
    public readonly name: string,
    public readonly description?: string,
  ) {
    super();
  }
}
