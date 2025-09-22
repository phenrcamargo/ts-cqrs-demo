import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdateChainCommand, {
  UpdatedChainDTO,
} from "src/domain/partner/commands/update-chain.command";
import {
  ChainRepository,
  ChainRepositoryToken,
} from "src/domain/partner/repositories/chain.repository";
import { ChainNotFoundError } from "../errors/chain-not-found.error";
import Chain from "src/domain/partner/entities/chain";
import { ID } from "src/domain/partner/value-objects/id.vo";

@CommandHandler(UpdateChainCommand)
export default class UpdateChainCommandHandler
  implements ICommandHandler<UpdateChainCommand>
{
  constructor(
    @Inject(ChainRepositoryToken)
    private readonly chainRepository: ChainRepository,
  ) {}

  async execute(command: UpdateChainCommand): Promise<UpdatedChainDTO> {
    const { chainId, name, description, currencyCode, countryCode } = command;

    const chain = await this.checkChainExistsAndReturnIt(ID.create(chainId));

    chain.updateDetails({
      name,
      description,
      countryCode,
      currencyCode,
    });

    const updatedChain = await this.chainRepository.saveOrUpdate(chain);
    return {
      chainId: updatedChain.id.value,
      name: updatedChain.name.value,
      description: updatedChain.description.value,
      currencyCode: updatedChain.currencyCode,
      countryCode: updatedChain.countryCode,
    };
  }

  private async checkChainExistsAndReturnIt(chainId: ID): Promise<Chain> {
    const chain = await this.chainRepository.findById(chainId);

    if (!chain) {
      throw new ChainNotFoundError(chainId.value);
    }

    return chain;
  }
}
