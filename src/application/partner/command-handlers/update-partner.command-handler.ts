import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdatePartnerCommand, {
  UpdatedPartnerDTO,
} from "src/domain/partner/commands/update-partner.command";
import Partner from "src/domain/partner/entities/partner";
import {
  PartnerRepository,
  PartnerRepositoryToken,
} from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { PartnerNotFoundError } from "../errors/partner-not-found.error";

@CommandHandler(UpdatePartnerCommand)
export default class UpdatePartnerCommandHandler
  implements ICommandHandler<UpdatePartnerCommand>
{
  constructor(
    @Inject(PartnerRepositoryToken)
    private readonly partnerRepository: PartnerRepository,
  ) {}

  async execute(command: UpdatePartnerCommand): Promise<UpdatedPartnerDTO> {
    const { partnerId, name, description, document } = command;

    const partner = await this.checkPartnerExistsAndReturnIt(
      ID.create(partnerId),
    );

    partner.updateDetails({
      name,
      description,
      document,
    });

    const updatedPartner = await this.partnerRepository.saveOrUpdate(partner);
    return this.mapToDTO(updatedPartner);
  }

  private async checkPartnerExistsAndReturnIt(partnerId: ID): Promise<Partner> {
    const partner = await this.partnerRepository.findById(partnerId);
    if (!partner) {
      throw new PartnerNotFoundError(partnerId.value);
    }
    return partner;
  }

  private mapToDTO(partner: Partner): UpdatedPartnerDTO {
    return {
      name: partner.name.value,
      description: partner.description.value,
      document: {
        value: partner.document.value,
        countryCode: partner.document.country,
        typeCode: partner.document.type,
      },
      updatedAt: new Date(partner.updatedAt ?? Date.now()),
    };
  }
}
