import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import DeletePartnerCommand from "src/domain/partner/commands/delete-partner.command";
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from "src/domain/partner/repositories/company.repository";
import {
  PartnerRepository,
  PartnerRepositoryToken,
} from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { PartnerNotFoundError } from "../errors/partner-not-found.error";
import { PartnerHasCompaniesError } from "../errors/partner-has-companies.error";
import Partner from "src/domain/partner/entities/partner";

@CommandHandler(DeletePartnerCommand)
export default class DeletePartnerCommandHandler
  implements ICommandHandler<DeletePartnerCommand>
{
  constructor(
    @Inject(PartnerRepositoryToken)
    private readonly partnerRepository: PartnerRepository,
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(command: DeletePartnerCommand): Promise<void> {
    const partnerId = ID.create(command.partnerId);

    const partner = await this.checkPartnerExistsAndReturnIt(partnerId);

    await this.checkCompaniesAssociatedWithPartner(partnerId);

    partner.delete();

    await this.partnerRepository.saveOrUpdate(partner);
  }

  private async checkPartnerExistsAndReturnIt(partnerId: ID): Promise<Partner> {
    const partner = await this.partnerRepository.findById(partnerId);

    if (!partner) {
      throw new PartnerNotFoundError(partnerId.value);
    }

    return partner;
  }

  private async checkCompaniesAssociatedWithPartner(
    partnerId: ID,
  ): Promise<void> {
    const companies = await this.companyRepository.findByPartnerId(partnerId);

    if (companies.length > 0) {
      throw new PartnerHasCompaniesError(partnerId.value);
    }
  }
}
