import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdateStoreCommand, {
  UpdatedStoreDTO,
} from "src/domain/partner/commands/update-store.command";
import {
  StoreRepository,
  StoreRepositoryToken,
} from "src/domain/partner/repositories/store.repository";
import { StoreNotFoundError } from "../errors/store-not-found.error";
import { ID } from "src/domain/partner/value-objects/id.vo";
import Store from "src/domain/partner/entities/store";

@CommandHandler(UpdateStoreCommand)
export default class UpdateStoreCommandHandler
  implements ICommandHandler<UpdateStoreCommand>
{
  constructor(
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(command: UpdateStoreCommand): Promise<UpdatedStoreDTO> {
    const { storeId, name, description, phone, address } = command;

    const store = await this.checkStoreExistsAndReturnIt(ID.create(storeId));

    store.updateDetails({
      name,
      description,
      phone,
      address,
    });

    const updatedStore = await this.storeRepository.saveOrUpdate(store);
    return this.mapToUpdatedStore(updatedStore);
  }

  private async checkStoreExistsAndReturnIt(storeId: ID): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new StoreNotFoundError(storeId.value);
    }
    return store;
  }

  private mapToUpdatedStore(store: Store): UpdatedStoreDTO {
    return {
      name: store.name.value,
      description: store.description.value,
      phone: store.phone.value,
      address: {
        number: store.address?.number,
        street: store.address?.street,
        city: store.address?.city,
        state: store.address?.state,
        country: store.address?.country,
        zipCode: store.address?.zipCode,
        latitude: store.address?.latitude,
        longitude: store.address?.longitude,
      },
    };
  }
}
