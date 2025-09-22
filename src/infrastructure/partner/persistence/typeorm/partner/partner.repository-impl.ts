import Partner from "src/domain/partner/entities/partner";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";
import { Document } from "src/domain/partner/value-objects/document.vo";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { PartnerOrmEntity } from "./partner.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class PartnerRepositoryImpl implements PartnerRepository {
  constructor(
    @InjectRepository(PartnerOrmEntity, "core")
    private readonly partnerOrmRepository: Repository<PartnerOrmEntity>,
  ) {}

  async findById(id: ID): Promise<Partner | undefined> {
    const ormEntity = await this.partnerOrmRepository.findOne({
      where: { id: id.value },
    });

    if (!ormEntity) {
      return undefined;
    }

    return this._toDomainEntity(ormEntity);
  }

  async findByDocument(document: Document): Promise<Partner | undefined> {
    const ormEntity = await this.partnerOrmRepository.findOne({
      where: { document: document.value, documentType: document.type },
    });

    if (!ormEntity) {
      return undefined;
    }

    return this._toDomainEntity(ormEntity);
  }

  async saveOrUpdate(partner: Partner): Promise<Partner> {
    const ormEntity = this._toOrmEntity(partner);
    const ormEntityReturned = await this.partnerOrmRepository.save(ormEntity);
    return this._toDomainEntity(ormEntityReturned);
  }

  private _toDomainEntity(ormEntity: PartnerOrmEntity): Partner {
    return new Partner({
      id: ormEntity.id,
      document: ormEntity.document,
      documentTypeCode: ormEntity.documentType,
      countryCode: ormEntity.countryCode,
      name: ormEntity.name,
      description: ormEntity.description,
      createdAt: ormEntity.createdAt.getTime(),
      updatedAt: ormEntity.updatedAt?.getTime(),
      disabledAt: ormEntity.disabledAt?.getTime(),
    });
  }

  private _toOrmEntity(partner: Partner): PartnerOrmEntity {
    return {
      id: partner.id.value,
      document: partner.document.value,
      documentType: partner.document.type,
      countryCode: partner.document.country,
      name: partner.name.value,
      description: partner.description.value,
      createdAt: new Date(partner.createdAt),
      updatedAt: partner.updatedAt ? new Date(partner.updatedAt) : undefined,
      disabledAt: partner.disabledAt ? new Date(partner.disabledAt) : undefined,
    };
  }
}
