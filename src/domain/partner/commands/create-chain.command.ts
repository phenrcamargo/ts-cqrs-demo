import { Command } from "@nestjs/cqrs";

export default class CreateChainCommand extends Command<string> {
  constructor(
    public readonly companyId: string,
    public readonly name: string,
    public readonly currencyCode: number,
    public readonly countryCode: number,
    public readonly description?: string,
  ) {
    super();
  }
}
