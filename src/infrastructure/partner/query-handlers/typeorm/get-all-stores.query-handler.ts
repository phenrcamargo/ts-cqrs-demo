import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetAllStoresQuery,
  GetAllStoresResponse,
} from "src/application/partner/queries/get-all-stores.query";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { Repository } from "typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";
import { StoreRow } from "../types/store-row.type";

@QueryHandler(GetAllStoresQuery)
export class GetAllStoresQueryHandler
  implements IQueryHandler<GetAllStoresQuery>
{
  constructor(
    @InjectRepository(StoreOrmEntity, "core")
    private readonly storeRepository: Repository<StoreOrmEntity>,
  ) {}

  async execute(): Promise<GetAllStoresResponse> {
    const stores = await this.storeRepository
      .createQueryBuilder("store")
      .innerJoin(ChainOrmEntity, "chain", "chain.id = store.chainId")
      .select([
        "store.id as id",
        'store.chainId as "chainId"',
        "store.name as name",
        "store.description as description",
        "store.phone as phone",
        'store.document as "documentValue"',
        'store.documentType as "documentType"',
        'chain.country_code as "documentCountry"',
        'store.addressNumber as "addressNumber"',
        'store.addressStreet as "addressStreet"',
        'store.addressCity as "addressCity"',
        'store.addressState as "addressState"',
        'store.addressCountry as "addressCountry"',
        'store.addressZipcode as "addressZipCode"',
        'store.addressLatitude as "addressLatitude"',
        'store.addressLongitude as "addressLongitude"',
        'store.createdAt as "createdAt"',
        'store.updatedAt as "updatedAt"',
        'store.disabledAt as "disabledAt"',
      ])
      .getRawMany<StoreRow>();

    if (!stores || stores.length === 0) {
      return [];
    }

    return stores.map((store) => ({
      id: store.id,
      chainId: store.chainId,
      name: store.name,
      description: store.description,
      phone: store.phone,

      address: {
        number: store.addressNumber,
        street: store.addressStreet,
        city: store.addressCity,
        state: store.addressState,
        country: store.addressCountry,
        zip: store.addressZipCode,
        latitude: store.addressLatitude,
        longitude: store.addressLongitude,
      },

      document: {
        value: store.documentValue,
        type: getDocumentTypeNameByCode(store.documentType),
        country: getCountryNameByCode(store.documentCountry),
      },

      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      disabledAt: store.disabledAt,
    }));
  }
}
