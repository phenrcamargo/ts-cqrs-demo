import Company from "src/domain/partner/entities/company";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyOrmEntity } from "./company.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity, "core")
    private readonly companyOrmRepository: Repository<CompanyOrmEntity>,
  ) {}

  async findById(id: ID): Promise<Company | undefined> {
    const ormEntity = await this.companyOrmRepository.findOne({
      where: { id: id.value },
    });

    if (!ormEntity) {
      return undefined;
    }

    return this._toDomainEntity(ormEntity);
  }

  async findByPartnerId(partnerId: ID): Promise<Company[]> {
    const ormEntities = await this.companyOrmRepository.find({
      where: { partnerId: partnerId.value },
    });

    if (!ormEntities || ormEntities.length === 0) return [];

    return ormEntities.map((ormEntity) => this._toDomainEntity(ormEntity));
  }

  async saveOrUpdate(company: Company): Promise<Company> {
    const ormEntity = this._toOrmEntity(company);
    const ormEntityReturned = await this.companyOrmRepository.save(ormEntity);
    return this._toDomainEntity(ormEntityReturned);
  }

  private _toDomainEntity(ormEntity: CompanyOrmEntity): Company {
    return new Company({
      id: ormEntity.id,
      partnerId: ormEntity.partnerId,
      name: ormEntity.name,
      description: ormEntity.description,
      createdAt: ormEntity.createdAt.getTime(),
      updatedAt: ormEntity.updatedAt?.getTime(),
      disabledAt: ormEntity.disabledAt?.getTime(),
    });
  }

  private _toOrmEntity(company: Company): CompanyOrmEntity {
    return {
      id: company.id.value,
      partnerId: company.partnerId.value,
      name: company.name.value,
      description: company.description.value,
      createdAt: new Date(company.createdAt),
      updatedAt: company.updatedAt ? new Date(company.updatedAt) : undefined,
      disabledAt: company.disabledAt ? new Date(company.disabledAt) : undefined,
    };
  }
}
