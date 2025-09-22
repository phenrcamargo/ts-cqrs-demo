import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetChainsByCompanyIdQuery,
  GetChainsByCompanyIdResponse,
} from "src/application/partner/queries/get-chains-by-company-id.query";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { Repository } from "typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { ChainsByCompanyNotFoundError } from "src/application/partner/errors/chains-by-company-not-found.error";

@QueryHandler(GetChainsByCompanyIdQuery)
export class GetChainsByCompanyIdQueryHandler
  implements IQueryHandler<GetChainsByCompanyIdQuery>
{
  constructor(
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainRepository: Repository<ChainOrmEntity>,
  ) {}

  async execute(
    query: GetChainsByCompanyIdQuery,
  ): Promise<GetChainsByCompanyIdResponse> {
    const { companyId } = query;

    ID.validate(companyId);

    const chains = await this.chainRepository.find({
      where: { companyId: companyId },
    });

    if (!chains || chains.length === 0) {
      throw new ChainsByCompanyNotFoundError(companyId);
    }

    return chains.map((chain) => ({
      id: chain.id,
      companyId: chain.companyId,
      name: chain.name,
      description: chain.description,
      currency_code: chain.currency_code,
      country_code: chain.country_code,
      createdAt: chain.createdAt,
      updatedAt: chain.updatedAt,
      disabledAt: chain.disabledAt,
    }));
  }
}
