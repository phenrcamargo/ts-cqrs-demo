import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import DeleteChainCommand from "src/domain/partner/commands/delete-chain.command";
import {
  ChainRepository,
  ChainRepositoryToken,
} from "src/domain/partner/repositories/chain.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { ChainNotFoundError } from "../errors/chain-not-found.error";
import {
  StoreRepository,
  StoreRepositoryToken,
} from "src/domain/partner/repositories/store.repository";
import { ChainHasStoresError } from "../errors/chain-has-stores.error";
import Chain from "src/domain/partner/entities/chain";

@CommandHandler(DeleteChainCommand)
export default class DeleteChainCommandHandler
  implements ICommandHandler<DeleteChainCommand>
{
  constructor(
    @Inject(ChainRepositoryToken)
    private readonly chainRepository: ChainRepository,
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}
  async execute(command: DeleteChainCommand): Promise<void> {
    const chainId = ID.create(command.chainId);

    const chain = await this.checkChainExistsAndReturnIt(chainId);

    await this.checkStoresAssociatedWithChain(chainId);

    chain.delete();

    await this.chainRepository.saveOrUpdate(chain);
  }

  private async checkChainExistsAndReturnIt(chainId: ID): Promise<Chain> {
    const chain = await this.chainRepository.findById(chainId);

    if (!chain) {
      throw new ChainNotFoundError(chainId.value);
    }

    return chain;
  }

  private async checkStoresAssociatedWithChain(chainId: ID): Promise<void> {
    const stores = await this.storeRepository.findByChainId(chainId);

    if (stores.length > 0) {
      throw new ChainHasStoresError(chainId.value);
    }
  }
}
