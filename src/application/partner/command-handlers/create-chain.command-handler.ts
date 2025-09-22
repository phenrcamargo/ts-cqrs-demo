import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreateChainCommand from "src/domain/partner/commands/create-chain.command";
import Chain from "src/domain/partner/entities/chain";
import {
  ChainRepository,
  ChainRepositoryToken,
} from "src/domain/partner/repositories/chain.repository";
import { CompanyNotFoundError } from "../errors/company-not-found.error";
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyIsDisabled } from "../errors/company-is-disabled.error";

@CommandHandler(CreateChainCommand)
export default class CreateChainCommandHandler
  implements ICommandHandler<CreateChainCommand>
{
  constructor(
    @Inject(ChainRepositoryToken)
    private readonly chainRepository: ChainRepository,
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(command: CreateChainCommand): Promise<string> {
    const { companyId, name, description, currencyCode, countryCode } = command;

    await this.checkCompanyExists(companyId);

    const chain = new Chain({
      companyId: companyId,
      name: name,
      description: description,
      currencyCode: currencyCode,
      countryCode: countryCode,
      createdAt: Date.now(),
    });

    const createdChain = await this.chainRepository.saveOrUpdate(chain);
    return createdChain.id.value;
  }

  private async checkCompanyExists(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(ID.create(companyId));

    if (!company) {
      throw new CompanyNotFoundError(companyId);
    }

    if (company.disabledAt) {
      throw new CompanyIsDisabled(companyId);
    }
  }
}
