import { Command } from "@nestjs/cqrs";

export default class CreatePartnerCommand extends Command<string> {
  constructor(
    public readonly document: string,
    public readonly documentTypeCode: number,
    public readonly countryCode: number,
    public readonly name: string,
    public readonly description?: string,
  ) {
    super();
  }
}
