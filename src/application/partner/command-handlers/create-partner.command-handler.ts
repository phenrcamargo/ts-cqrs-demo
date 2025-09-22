import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreatePartnerCommand from "src/domain/partner/commands/create-partner.command";
import {
  PartnerRepository,
  PartnerRepositoryToken,
} from "src/domain/partner/repositories/partner.repository";
import { Document } from "src/domain/partner/value-objects/document.vo";
import { PartnerDocumentAlreadyExistsError } from "../errors/partner-document-alreay-exists.error";
import Partner from "src/domain/partner/entities/partner";
import {
  StoreRepository,
  StoreRepositoryToken,
} from "src/domain/partner/repositories/store.repository";
import { StoreDocumentAlreadyExistsError } from "../errors/store-document-already-exists.error";

@CommandHandler(CreatePartnerCommand)
export default class CreatePartnerCommandHandler
  implements ICommandHandler<CreatePartnerCommand>
{
  constructor(
    @Inject(PartnerRepositoryToken)
    private readonly partnerRepository: PartnerRepository,
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(command: CreatePartnerCommand): Promise<string> {
    const { document, documentTypeCode, countryCode, name, description } =
      command;

    const documentVo = Document.create({
      value: document,
      countryCode: countryCode,
      typeCode: documentTypeCode,
    });

    await this.checkStoreWithSameDocumentExists(documentVo);

    await this.checkPartnerExists(documentVo);

    const partner = new Partner({
      document: document,
      documentTypeCode: documentTypeCode,
      countryCode: countryCode,
      name: name,
      description: description,
      createdAt: Date.now(),
    });

    const partnerCreated = await this.partnerRepository.saveOrUpdate(partner);
    return partnerCreated.id.value;
  }

  private async checkStoreWithSameDocumentExists(
    document: Document,
  ): Promise<void> {
    const store = await this.storeRepository.findByDocument(document);
    if (store) {
      throw new StoreDocumentAlreadyExistsError(document.value);
    }
  }

  private async checkPartnerExists(document: Document): Promise<void> {
    const partner = await this.partnerRepository.findByDocument(document);
    if (partner) {
      throw new PartnerDocumentAlreadyExistsError(document.value);
    }
  }
}
