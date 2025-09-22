import { Injectable } from "@nestjs/common";
import Store from "src/domain/partner/entities/store";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";
import { Document } from "src/domain/partner/value-objects/document.vo";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { StoreOrmEntity } from "./store.orm-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChainOrmEntity } from "../chain/chain.orm-entity";
import { ChainNotFoundError } from "src/application/partner/errors/chain-not-found.error";

@Injectable()
export default class StoreRepositoryImpl implements StoreRepository {
  constructor(
    @InjectRepository(StoreOrmEntity, "core")
    private readonly storeOrmRepository: Repository<StoreOrmEntity>,
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainOrmRepository: Repository<ChainOrmEntity>,
  ) {}

  async findById(id: ID): Promise<Store | undefined> {
    const ormEntity = await this.storeOrmRepository.findOne({
      where: { id: id.value },
    });

    if (!ormEntity) return undefined;

    const chainOrmEntity = await this.chainOrmRepository.findOne({
      where: { id: ormEntity.chainId },
    });

    if (!chainOrmEntity) throw new ChainNotFoundError(ormEntity.chainId);

    return this._toDomainEntity(ormEntity, chainOrmEntity);
  }

  async findByDocument(document: Document): Promise<Store | undefined> {
    const ormEntity = await this.storeOrmRepository.findOne({
      where: { document: document.value, documentType: document.type },
    });

    if (!ormEntity) return undefined;

    const chainOrmEntity = await this.chainOrmRepository.findOne({
      where: { id: ormEntity.chainId },
    });

    if (!chainOrmEntity) throw new ChainNotFoundError(ormEntity.chainId);

    return this._toDomainEntity(ormEntity, chainOrmEntity);
  }

  async findByChainId(chainId: ID): Promise<Store[]> {
    const chainOrmEntity = await this.chainOrmRepository.findOne({
      where: { id: chainId.value },
    });

    if (!chainOrmEntity) throw new ChainNotFoundError(chainId.value);

    const ormEntities = await this.storeOrmRepository.find({
      where: { chainId: chainId.value },
    });

    if (ormEntities.length === 0) return [];

    return ormEntities.map((ormEntity) =>
      this._toDomainEntity(ormEntity, chainOrmEntity),
    );
  }

  async saveOrUpdate(store: Store): Promise<Store> {
    const ormEntity = this._toOrmEntity(store);
    await this.storeOrmRepository.save(ormEntity);

    return store;
  }

  private _toDomainEntity(
    ormEntity: StoreOrmEntity,
    chainOrmEntity: ChainOrmEntity,
  ): Store {
    return new Store({
      id: ormEntity.id,
      chainId: ormEntity.chainId,
      chainCountryCode: chainOrmEntity.country_code,
      document: ormEntity.document,
      documentTypeCode: ormEntity.documentType,
      name: ormEntity.name,
      description: ormEntity.description,
      phone: ormEntity.phone,
      address: {
        number: ormEntity.address.number,
        street: ormEntity.address.street,
        city: ormEntity.address.city,
        state: ormEntity.address.state,
        country: ormEntity.address.country,
        zipCode: ormEntity.address.zipCode,
        latitude: ormEntity.address.latitude,
        longitude: ormEntity.address.longitude,
      },
      createdAt: ormEntity.createdAt.getTime(),
      updatedAt: ormEntity.updatedAt?.getTime(),
      disabledAt: ormEntity.disabledAt?.getTime(),
    });
  }

  private _toOrmEntity(store: Store): StoreOrmEntity {
    return {
      id: store.id.value,
      chainId: store.chainId.value,
      document: store.document.value,
      documentType: store.document.type,
      name: store.name.value,
      description: store.description.value,
      phone: store.phone.value,
      address: {
        number: store.address.number,
        street: store.address.street,
        city: store.address.city,
        state: store.address.state,
        country: store.address.country,
        zipCode: store.address.zipCode,
        latitude: store.address.latitude,
        longitude: store.address.longitude,
      },
      createdAt: new Date(store.createdAt),
      updatedAt: store.updatedAt ? new Date(store.updatedAt) : undefined,
      disabledAt: store.disabledAt ? new Date(store.disabledAt) : undefined,
    };
  }
}
