import { Command } from "@nestjs/cqrs";

export type UpdatedChainDTO = {
  chainId: string;
  name?: string;
  description?: string;
  currencyCode?: number;
  countryCode?: number;
};
export default class UpdateChainCommand extends Command<UpdatedChainDTO> {
  constructor(
    public readonly chainId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly currencyCode?: number,
    public readonly countryCode?: number,
  ) {
    super();
  }
}
