import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { Repository } from "typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { StoreRow } from "../types/store-row.type";
import {
  GetStoresByCompanyIdQuery,
  GetStoresByCompanyIdResponse,
} from "src/application/partner/queries/get-stores-by-company-id.query";
import { StoreByCompanyNotFoundError } from "src/application/partner/errors/stores-by-company-not-found.error";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetStoresByCompanyIdQuery)
export class GetStoresByCompanyIdQueryHandler
  implements IQueryHandler<GetStoresByCompanyIdQuery>
{
  constructor(
    @InjectRepository(StoreOrmEntity, "core")
    private readonly storeRepository: Repository<StoreOrmEntity>,
  ) {}

  async execute(
    query: GetStoresByCompanyIdQuery,
  ): Promise<GetStoresByCompanyIdResponse> {
    const { companyId } = query;

    ID.validate(companyId);

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
        'store.createdAt as "createdAt"',
        'store.updatedAt as "updatedAt"',
        'store.disabledAt as "disabledAt"',
      ])
      .where("chain.companyId = :companyId", { companyId })
      .getRawMany<StoreRow>();

    if (!stores || stores.length === 0) {
      throw new StoreByCompanyNotFoundError(companyId);
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
