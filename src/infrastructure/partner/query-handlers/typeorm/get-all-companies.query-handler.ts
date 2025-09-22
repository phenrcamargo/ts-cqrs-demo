import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetAllCompaniesQuery,
  GetAllCompaniesResponse,
} from "src/application/partner/queries/get-all-companies.query";
import { CompanyOrmEntity } from "../../persistence/typeorm/company/company.orm-entity";
import { Repository } from "typeorm";

@QueryHandler(GetAllCompaniesQuery)
export class GetAllCompaniesQueryHandler
  implements IQueryHandler<GetAllCompaniesQuery>
{
  constructor(
    @InjectRepository(CompanyOrmEntity, "core")
    private readonly companyRepository: Repository<CompanyOrmEntity>,
  ) {}

  async execute(): Promise<GetAllCompaniesResponse> {
    const ormEntities = await this.companyRepository.find();

    if (!ormEntities || ormEntities.length === 0) {
      return [];
    }

    return ormEntities.map((entity) => ({
      id: entity.id,
      partnerId: entity.partnerId,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      disabledAt: entity.disabledAt,
    }));
  }
}
