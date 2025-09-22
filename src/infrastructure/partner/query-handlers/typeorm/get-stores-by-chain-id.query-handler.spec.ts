import { StoreRow } from "../types/store-row.type";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { GetStoresByChainIdQuery } from "src/application/partner/queries/get-stores-by-chain-id.query";
import { GetStoresByChainIdQueryHandler } from "./get-stores-by-chain-id.query-handler";

describe("GetStoresByChainIdQueryHandler", () => {
  const storeOrmRepository = mock<Repository<StoreOrmEntity>>();
  const queryBuilderMock = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  let sut: GetStoresByChainIdQueryHandler;
  let query: GetStoresByChainIdQuery;
  let storeRow: StoreRow;

  beforeEach(() => {
    sut = new GetStoresByChainIdQueryHandler(storeOrmRepository);
    (storeOrmRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      queryBuilderMock,
    );

    storeRow = {
      id: "valid-store-id",
      chainId: "valid-chain-id",
      name: "Store Test",
      description: "Store description",
      phone: "1234567890",
      documentValue: "02952561000469",
      documentType: 2,
      documentCountry: 1058,
      addressNumber: 123,
      addressStreet: "Main St",
      addressCity: "Anytown",
      addressState: "CA",
      addressCountry: "USA",
      addressZipCode: "12345",
      addressLatitude: 37.7749,
      addressLongitude: -122.4194,
      createdAt: new Date(),
      updatedAt: new Date(),
      disabledAt: undefined,
    };
  });

  it("should throw an error if invalid chain ID", async () => {
    query = new GetStoresByChainIdQuery("invalid-chain-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if stores not found", async () => {
    query = new GetStoresByChainIdQuery(ID.create().value);
    queryBuilderMock.getRawMany.mockResolvedValue([]);

    await expect(sut.execute(query)).rejects.toThrow(
      `No stores found for chain with ID: ${query.chainId}.`,
    );
  });

  it("should return the store if found", async () => {
    query = new GetStoresByChainIdQuery(ID.create().value);
    queryBuilderMock.getRawMany.mockResolvedValue([storeRow]);

    const result = await sut.execute(query);

    expect(result).toEqual([
      {
        id: storeRow.id,
        chainId: storeRow.chainId,
        name: storeRow.name,
        description: storeRow.description,
        phone: storeRow.phone,

        address: {
          number: storeRow.addressNumber,
          street: storeRow.addressStreet,
          city: storeRow.addressCity,
          state: storeRow.addressState,
          country: storeRow.addressCountry,
          zip: storeRow.addressZipCode,
        },

        document: {
          value: storeRow.documentValue,
          type: "CNPJ",
          country: "BRAZIL",
        },

        createdAt: storeRow.createdAt,
        updatedAt: storeRow.updatedAt,
        disabledAt: storeRow.disabledAt,
      },
    ]);
  });
});
