import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  GetAllChainsQuery,
  GetAllChainsResponse,
} from "../../../../application/partner/queries/get-all-chains.query";
import { InjectRepository } from "@nestjs/typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { Repository } from "typeorm";

@QueryHandler(GetAllChainsQuery)
export class GetAllChainsQueryHandler
  implements IQueryHandler<GetAllChainsQuery>
{
  constructor(
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainRepository: Repository<ChainOrmEntity>,
  ) {}

  async execute(): Promise<GetAllChainsResponse> {
    const ormEntities = await this.chainRepository.find();

    if (!ormEntities || ormEntities.length === 0) {
      return [];
    }

    return ormEntities.map((entity) => ({
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      description: entity.description,
      currency_code: entity.currency_code,
      country_code: entity.country_code,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      disabledAt: entity.disabledAt,
    }));
  }
}
