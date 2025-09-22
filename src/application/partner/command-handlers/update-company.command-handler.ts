import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdateCompanyCommand, {
  UpdatedCompanyDTO,
} from "src/domain/partner/commands/update-company.command";
import Company from "src/domain/partner/entities/company";
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyNotFoundError } from "../errors/company-not-found.error";

@CommandHandler(UpdateCompanyCommand)
export default class UpdateCompanyCommandHandler
  implements ICommandHandler<UpdateCompanyCommand>
{
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(command: UpdateCompanyCommand): Promise<UpdatedCompanyDTO> {
    const { companyId, name, description } = command;

    const company = await this.checkCompanyExistsAndReturnIt(
      ID.create(companyId),
    );

    company.updateDetails({
      name,
      description,
    });

    const updatedCompany = await this.companyRepository.saveOrUpdate(company);
    return {
      companyId: updatedCompany.id.value,
      name: updatedCompany.name.value,
      description: updatedCompany.description.value,
    };
  }

  private async checkCompanyExistsAndReturnIt(companyId: ID): Promise<Company> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new CompanyNotFoundError(companyId.value);
    }

    return company;
  }
}
