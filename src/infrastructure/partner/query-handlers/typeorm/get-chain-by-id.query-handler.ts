import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  GetChainByIdQuery,
  GetChainByIdResponse,
} from "../../../../application/partner/queries/get-chain-by-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { Repository } from "typeorm";
import { ChainNotFoundError } from "src/application/partner/errors/chain-not-found.error";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetChainByIdQuery)
export class GetChainByIdQueryHandler
  implements IQueryHandler<GetChainByIdQuery>
{
  constructor(
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainRepository: Repository<ChainOrmEntity>,
  ) {}

  async execute(query: GetChainByIdQuery): Promise<GetChainByIdResponse> {
    const { chainId } = query;

    ID.validate(chainId);

    const ormEntity = await this.chainRepository.findOne({
      where: { id: chainId },
    });

    if (!ormEntity) {
      throw new ChainNotFoundError(chainId);
    }

    return {
      id: ormEntity.id,
      companyId: ormEntity.companyId,
      name: ormEntity.name,
      description: ormEntity.description,
      currency_code: ormEntity.currency_code,
      country_code: ormEntity.country_code,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      disabledAt: ormEntity.disabledAt,
    };
  }
}
