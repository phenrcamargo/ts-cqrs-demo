import Chain from "src/domain/partner/entities/chain";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import { ChainOrmEntity } from "./chain.orm-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class ChainRepositoryImpl implements ChainRepository {
  constructor(
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainOrmRepository: Repository<ChainOrmEntity>,
  ) {}

  async findById(id: ID): Promise<Chain | undefined> {
    const ormEntity = await this.chainOrmRepository.findOne({
      where: { id: id.value },
    });

    if (!ormEntity) {
      return undefined;
    }

    return this._toDomainEntity(ormEntity);
  }

  async findByCompanyId(companyId: ID): Promise<Chain[]> {
    const ormEntities = await this.chainOrmRepository.find({
      where: { companyId: companyId.value },
    });

    if (!ormEntities || ormEntities.length === 0) {
      return [];
    }

    return ormEntities.map((ormEntity) => this._toDomainEntity(ormEntity));
  }

  async saveOrUpdate(chain: Chain): Promise<Chain> {
    const ormEntity = this._toOrmEntity(chain);
    const ormEntityReturned = await this.chainOrmRepository.save(ormEntity);
    return this._toDomainEntity(ormEntityReturned);
  }

  private _toDomainEntity(ormEntity: ChainOrmEntity): Chain {
    return new Chain({
      id: ormEntity.id,
      companyId: ormEntity.companyId,
      name: ormEntity.name,
      description: ormEntity.description,
      currencyCode: ormEntity.currency_code,
      countryCode: ormEntity.country_code,
      createdAt: ormEntity.createdAt.getTime(),
      updatedAt: ormEntity.updatedAt?.getTime(),
      disabledAt: ormEntity.disabledAt?.getTime(),
    });
  }

  private _toOrmEntity(chain: Chain): ChainOrmEntity {
    return {
      id: chain.id.value,
      companyId: chain.companyId.value,
      name: chain.name.value,
      description: chain.description.value,
      currency_code: chain.currencyCode,
      country_code: chain.countryCode,
      createdAt: new Date(chain.createdAt),
      updatedAt: chain.updatedAt ? new Date(chain.updatedAt) : undefined,
      disabledAt: chain.disabledAt ? new Date(chain.disabledAt) : undefined,
    };
  }
}
