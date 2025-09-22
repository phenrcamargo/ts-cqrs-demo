import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import DeleteCompanyCommand from "src/domain/partner/commands/delete-company.command";
import {
  ChainRepository,
  ChainRepositoryToken,
} from "src/domain/partner/repositories/chain.repository";
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyNotFoundError } from "../errors/company-not-found.error";
import { CompanyHasChainsError } from "../errors/company-has-chains.error";
import Company from "src/domain/partner/entities/company";

@CommandHandler(DeleteCompanyCommand)
export default class DeleteCompanyCommandHandler
  implements ICommandHandler<DeleteCompanyCommand>
{
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
    @Inject(ChainRepositoryToken)
    private readonly chainRepository: ChainRepository,
  ) {}

  async execute(command: DeleteCompanyCommand): Promise<void> {
    const companyId = ID.create(command.id);

    const company = await this.checkCompanyExistsAndReturnIt(companyId);

    await this.checkChainsAssociatedWithCompany(companyId);

    company.delete();

    await this.companyRepository.saveOrUpdate(company);
  }

  private async checkCompanyExistsAndReturnIt(companyId: ID): Promise<Company> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new CompanyNotFoundError(companyId.value);
    }

    return company;
  }

  private async checkChainsAssociatedWithCompany(companyId: ID): Promise<void> {
    const chains = await this.chainRepository.findByCompanyId(companyId);

    if (chains.length > 0) {
      throw new CompanyHasChainsError(companyId.value);
    }
  }
}
