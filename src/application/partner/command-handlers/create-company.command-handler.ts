import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreateCompanyCommand from "src/domain/partner/commands/create-company.command";
import Company from "src/domain/partner/entities/company";
import {
  CompanyRepositoryToken,
  CompanyRepository,
} from "src/domain/partner/repositories/company.repository";
import {
  PartnerRepository,
  PartnerRepositoryToken,
} from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { PartnerNotFoundError } from "../errors/partner-not-found.error";
import { PartnerIsDisabled } from "../errors/partner-is-disabled.error";

@CommandHandler(CreateCompanyCommand)
export default class CreateCompanyCommandHandler
  implements ICommandHandler<CreateCompanyCommand>
{
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
    @Inject(PartnerRepositoryToken)
    private readonly partnerRepository: PartnerRepository,
  ) {}

  async execute(command: CreateCompanyCommand): Promise<string> {
    const { partnerId, name, description } = command;

    await this.checkPartnerExists(partnerId);

    const company = new Company({
      partnerId: partnerId,
      name: name,
      description: description,
      createdAt: Date.now(),
    });

    const companyCreated = await this.companyRepository.saveOrUpdate(company);
    return companyCreated.id.value;
  }

  private async checkPartnerExists(partnerId: string): Promise<void> {
    const partner = await this.partnerRepository.findById(ID.create(partnerId));

    if (!partner) {
      throw new PartnerNotFoundError(partnerId);
    }

    if (partner.disabledAt) {
      throw new PartnerIsDisabled(partnerId);
    }
  }
}
