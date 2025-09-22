import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetStoreByIdQuery,
  GetStoreByIdResponse,
} from "src/application/partner/queries/get-store-by-id.query";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { Repository } from "typeorm";
import { StoreNotFoundError } from "src/application/partner/errors/store-not-found.error";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { StoreRow } from "../types/store-row.type";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetStoreByIdQuery)
export class GetStoreByIdQueryHandler
  implements IQueryHandler<GetStoreByIdQuery>
{
  constructor(
    @InjectRepository(StoreOrmEntity, "core")
    private readonly storeRepository: Repository<StoreOrmEntity>,
  ) {}

  async execute(query: GetStoreByIdQuery): Promise<GetStoreByIdResponse> {
    const { storeId } = query;

    ID.validate(storeId);

    const store = await this.storeRepository
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
        'store.createdAt as "createdAt"',
        'store.updatedAt as "updatedAt"',
        'store.disabledAt as "disabledAt"',
      ])
      .where("store.id = :storeId", { storeId })
      .getRawOne<StoreRow>();

    if (!store) {
      throw new StoreNotFoundError(storeId);
    }

    return {
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
      },

      document: {
        value: store.documentValue,
        type: getDocumentTypeNameByCode(store.documentType),
        country: getCountryNameByCode(store.documentCountry),
      },

      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      disabledAt: store.disabledAt,
    };
  }
}
