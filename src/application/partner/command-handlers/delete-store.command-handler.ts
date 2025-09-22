import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import DeleteStoreCommand from "src/domain/partner/commands/delete-store.command";
import {
  StoreRepository,
  StoreRepositoryToken,
} from "src/domain/partner/repositories/store.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { StoreNotFoundError } from "../errors/store-not-found.error";
import Store from "src/domain/partner/entities/store";

@CommandHandler(DeleteStoreCommand)
export default class DeleteStoreCommandHandler
  implements ICommandHandler<DeleteStoreCommand>
{
  constructor(
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(command: DeleteStoreCommand): Promise<void> {
    const storeId = ID.create(command.storeId);

    const store = await this.checkStoreExistsAndReturnIt(storeId);

    store.delete();

    await this.storeRepository.saveOrUpdate(store);
  }

  private async checkStoreExistsAndReturnIt(storeId: ID): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);

    if (!store) {
      throw new StoreNotFoundError(storeId.value);
    }

    return store;
  }
}
