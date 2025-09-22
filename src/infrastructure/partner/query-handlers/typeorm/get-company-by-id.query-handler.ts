import {
  GetCompanyByIdQuery,
  GetCompanyByIdResponse,
} from "src/application/partner/queries/get-company-by-id.query";
import { CompanyOrmEntity } from "../../persistence/typeorm/company/company.orm-entity";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyNotFoundError } from "src/application/partner/errors/company-not-found.error";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetCompanyByIdQuery)
export class GetCompanyByIdQueryHandler
  implements IQueryHandler<GetCompanyByIdQuery>
{
  constructor(
    @InjectRepository(CompanyOrmEntity, "core")
    private readonly companyRepository: Repository<CompanyOrmEntity>,
  ) {}

  async execute(query: GetCompanyByIdQuery): Promise<GetCompanyByIdResponse> {
    const { companyId } = query;

    ID.validate(companyId);

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new CompanyNotFoundError(companyId);
    }

    return {
      id: company.id,
      partnerId: company.partnerId,
      name: company.name,
      description: company.description,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      disabledAt: company.disabledAt,
    };
  }
}
