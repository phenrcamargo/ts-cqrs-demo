import { mock } from "jest-mock-extended";
import { GetFullChainByIdQuery } from "src/application/partner/queries/get-full-chain-by-id.query";
import { Repository } from "typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { ChainWithStoresRow } from "../types/chain-with-stores-row.type";
import { GetFullChainByIdQueryHandler } from "./get-full-chain-by-id.query-handler";
import { ID } from "src/domain/partner/value-objects/id.vo";

describe("GetFullChainByIdQueryHandler", () => {
  const chainOrmRepository = mock<Repository<ChainOrmEntity>>();
  const queryBuilderMock = {
    innerJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  let sut: GetFullChainByIdQueryHandler;
  let query: GetFullChainByIdQuery;
  let chainWithStoresRow: ChainWithStoresRow;

  beforeEach(() => {
    sut = new GetFullChainByIdQueryHandler(chainOrmRepository);
    (chainOrmRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      queryBuilderMock,
    );

    chainWithStoresRow = {
      chain_id: "some-chain-id",
      chain_companyId: "some-company-id",
      chain_name: "Some Chain",
      chain_description: "Some description",
      chain_currency_code: 840,
      chain_country_code: 1058,
      chain_createdAt: new Date(),
      chain_updatedAt: undefined,
      chain_disabledAt: undefined,

      store_id: "some-store-id",
      store_chainId: "some-chain-id",
      store_document: "some-document",
      store_documentType: 2,
      store_name: "Some Store",
      store_description: "Some description",
      store_phone: "123456789",

      store_addressNumber: 123,
      store_addressStreet: "Some Street",
      store_addressCity: "Some City",
      store_addressState: "Some State",
      store_addressCountry: "Some Country",
      store_addressZipcode: "12345",
      store_addressLatitude: 1.234,
      store_addressLongitude: 5.678,

      store_createdAt: new Date(),
      store_updatedAt: undefined,
      store_disabledAt: undefined,
    };
  });

  it("should throw an error if invalid chain ID", async () => {
    query = new GetFullChainByIdQuery("invalid-chain-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if chain not found", async () => {
    queryBuilderMock.getRawMany.mockResolvedValue([]);
    query = new GetFullChainByIdQuery(ID.create().value);

    await expect(sut.execute(query)).rejects.toThrow(
      `Chain with ID ${query.chainId} not found.`,
    );
  });

  it("should return the full chain with stores", async () => {
    queryBuilderMock.getRawMany.mockResolvedValue([chainWithStoresRow]);
    query = new GetFullChainByIdQuery(ID.create().value);

    const result = await sut.execute(query);

    expect(result).toEqual({
      id: chainWithStoresRow.chain_id,
      companyId: chainWithStoresRow.chain_companyId,
      name: chainWithStoresRow.chain_name,
      description: chainWithStoresRow.chain_description,
      currency_code: chainWithStoresRow.chain_currency_code,
      country_code: chainWithStoresRow.chain_country_code,
      createdAt: chainWithStoresRow.chain_createdAt,
      updatedAt: chainWithStoresRow.chain_updatedAt,
      disabledAt: chainWithStoresRow.chain_disabledAt,
      stores: [
        {
          id: chainWithStoresRow.store_id,
          chainId: chainWithStoresRow.store_chainId,
          document: {
            value: chainWithStoresRow.store_document,
            type: "CNPJ",
            country: "BRAZIL",
          },
          name: chainWithStoresRow.store_name,
          description: chainWithStoresRow.store_description,
          phone: chainWithStoresRow.store_phone,
          address: {
            number: chainWithStoresRow.store_addressNumber,
            street: chainWithStoresRow.store_addressStreet,
            city: chainWithStoresRow.store_addressCity,
            state: chainWithStoresRow.store_addressState,
            country: chainWithStoresRow.store_addressCountry,
            zip: chainWithStoresRow.store_addressZipcode,
          },
          createdAt: chainWithStoresRow.store_createdAt,
          updatedAt: chainWithStoresRow.store_updatedAt,
          disabledAt: chainWithStoresRow.store_disabledAt,
        },
      ],
    });
  });
});
