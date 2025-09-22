import { InjectRepository } from "@nestjs/typeorm";
import {
  GetFullChainByIdQuery,
  GetFullChainByIdResponse,
} from "src/application/partner/queries/get-full-chain-by-id.query";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { Repository } from "typeorm";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ChainNotFoundError } from "src/application/partner/errors/chain-not-found.error";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";
import { ChainWithStoresRow } from "../types/chain-with-stores-row.type";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetFullChainByIdQuery)
export class GetFullChainByIdQueryHandler
  implements IQueryHandler<GetFullChainByIdQuery>
{
  constructor(
    @InjectRepository(ChainOrmEntity, "core")
    private readonly chainRepository: Repository<ChainOrmEntity>,
  ) {}

  async execute(
    query: GetFullChainByIdQuery,
  ): Promise<GetFullChainByIdResponse> {
    const { chainId } = query;

    ID.validate(chainId);

    const result = await this.chainRepository
      .createQueryBuilder("chain")
      .leftJoinAndSelect(StoreOrmEntity, "store", "store.chainId = chain.id")
      .where("chain.id = :chainId", { chainId })
      .getRawMany<ChainWithStoresRow>();

    if (!result || result.length === 0) {
      throw new ChainNotFoundError(chainId);
    }

    const chain = result[0];

    return {
      id: chain.chain_id,
      companyId: chain.chain_companyId,
      name: chain.chain_name,
      description: chain.chain_description,
      currency_code: chain.chain_currency_code,
      country_code: chain.chain_country_code,
      stores: result
        .filter((row) => row.store_id)
        .map((row) => ({
          id: row.store_id,
          chainId: row.store_chainId,
          name: row.store_name,
          description: row.store_description,
          phone: row.store_phone,
          address: {
            number: row.store_addressNumber,
            street: row.store_addressStreet,
            city: row.store_addressCity,
            state: row.store_addressState,
            country: row.store_addressCountry,
            zip: row.store_addressZipcode,
          },
          document: {
            value: row.store_document,
            type: getDocumentTypeNameByCode(row.store_documentType),
            country: getCountryNameByCode(chain.chain_country_code),
          },
          createdAt: row.store_createdAt,
          updatedAt: row.store_updatedAt,
          disabledAt: row.store_disabledAt,
        })),
      createdAt: chain.chain_createdAt,
      updatedAt: chain.chain_updatedAt,
      disabledAt: chain.chain_disabledAt,
    };
  }
}
