import { GetStoreByIdQuery } from "src/application/partner/queries/get-store-by-id.query";
import { StoreRow } from "../types/store-row.type";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { GetStoreByIdQueryHandler } from "./get-store-by-id.query-handler";
import { ID } from "src/domain/partner/value-objects/id.vo";

describe("GetStoreByIdQueryHandler", () => {
  const storeOrmRepository = mock<Repository<StoreOrmEntity>>();
  const queryBuilderMock = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  let sut: GetStoreByIdQueryHandler;
  let query: GetStoreByIdQuery;
  let storeRow: StoreRow;

  beforeEach(() => {
    sut = new GetStoreByIdQueryHandler(storeOrmRepository);
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

  it("should throw an error if invalid store ID", async () => {
    query = new GetStoreByIdQuery("invalid-store-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if store not found", async () => {
    query = new GetStoreByIdQuery(ID.create().value);
    queryBuilderMock.getRawOne.mockResolvedValue(null);

    await expect(sut.execute(query)).rejects.toThrow(
      `Store with ID ${query.storeId} not found.`,
    );
  });

  it("should return the store if found", async () => {
    query = new GetStoreByIdQuery(ID.create().value);
    queryBuilderMock.getRawOne.mockResolvedValue(storeRow);

    const result = await sut.execute(query);

    expect(result).toEqual({
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
    });
  });
});
