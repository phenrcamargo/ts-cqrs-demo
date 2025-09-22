import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreateStoreCommand from "src/domain/partner/commands/create-store.command";
import Chain from "src/domain/partner/entities/chain";
import {
  ChainRepository,
  ChainRepositoryToken,
} from "src/domain/partner/repositories/chain.repository";
import {
  StoreRepository,
  StoreRepositoryToken,
} from "src/domain/partner/repositories/store.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { ChainNotFoundError } from "../errors/chain-not-found.error";
import { Document } from "src/domain/partner/value-objects/document.vo";
import { StoreDocumentAlreadyExistsError } from "../errors/store-document-already-exists.error";
import Store from "src/domain/partner/entities/store";
import { ChainIsDisabled } from "../errors/chain-is-disabled.error";
import {
  PartnerRepository,
  PartnerRepositoryToken,
} from "src/domain/partner/repositories/partner.repository";
import { PartnerDocumentAlreadyExistsError } from "../errors/partner-document-alreay-exists.error";

@CommandHandler(CreateStoreCommand)
export default class CreateStoreCommandHandler
  implements ICommandHandler<CreateStoreCommand>
{
  constructor(
    @Inject(PartnerRepositoryToken)
    private readonly partnerRepository: PartnerRepository,
    @Inject(ChainRepositoryToken)
    private readonly chainRepository: ChainRepository,
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(command: CreateStoreCommand): Promise<string> {
    const {
      chainId,
      document,
      documentTypeCode,
      name,
      description,
      phone,
      address,
    } = command;

    const chain = await this.checkChainExistsAndReturnIt(chainId);

    const documentVo = Document.create({
      value: document,
      typeCode: documentTypeCode,
      countryCode: chain.countryCode,
    });

    await this.checkPartnerWithSameDocumentExists(documentVo);

    await this.checkStoreAlreadyExists(documentVo);

    const store = new Store({
      chainId: chainId,
      chainCountryCode: chain.countryCode,
      document: document,
      documentTypeCode: documentTypeCode,
      name: name,
      description: description,
      phone: phone,
      address: {
        number: address.number,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
        latitude: address.latitude,
        longitude: address.longitude,
      },
      createdAt: Date.now(),
    });

    const createdStore = await this.storeRepository.saveOrUpdate(store);
    return createdStore.id.value;
  }

  private async checkChainExistsAndReturnIt(chainId: string): Promise<Chain> {
    const chain = await this.chainRepository.findById(ID.create(chainId));

    if (!chain) {
      throw new ChainNotFoundError(chainId);
    }

    if (chain.disabledAt) {
      throw new ChainIsDisabled(chainId);
    }

    return chain;
  }

  private async checkPartnerWithSameDocumentExists(
    document: Document,
  ): Promise<void> {
    const partner = await this.partnerRepository.findByDocument(document);
    if (partner) {
      throw new PartnerDocumentAlreadyExistsError(document.value);
    }
  }

  private async checkStoreAlreadyExists(document: Document): Promise<void> {
    const store = await this.storeRepository.findByDocument(document);
    if (store) {
      throw new StoreDocumentAlreadyExistsError(document.value);
    }
  }
}
