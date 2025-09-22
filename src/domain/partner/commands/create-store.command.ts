import { Command } from "@nestjs/cqrs";

export default class CreateStoreCommand extends Command<string> {
  constructor(
    public readonly chainId: string,
    public readonly document: string,
    public readonly documentTypeCode: number,
    public readonly name: string,
    public readonly phone: string,
    public readonly address: {
      number: number;
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      latitude?: number;
      longitude?: number;
    },
    public readonly description?: string,
  ) {
    super();
  }
}
