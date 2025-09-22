import { mock } from "jest-mock-extended";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";
import { StoreOrmEntity } from "../../persistence/typeorm/store/store.orm-entity";
import { GetAllStoresQueryHandler } from "./get-all-stores.query-handler";
import { StoreRow } from "../types/store-row.type";

describe("GetAllStoresQueryHandler", () => {
  const storeOrmRepositoryMock = mock<Repository<StoreOrmEntity>>();
  const queryBuilderMock = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  let sut: GetAllStoresQueryHandler;
  let storeRow: StoreRow;

  beforeEach(() => {
    sut = new GetAllStoresQueryHandler(storeOrmRepositoryMock);
    (storeOrmRepositoryMock.createQueryBuilder as jest.Mock).mockReturnValue(
      queryBuilderMock,
    );

    storeRow = {
      id: ID.create().value,
      chainId: ID.create().value,
      name: "Test Store",
      description: "Test Description",
      phone: "123456789",
      documentValue: "123456789",
      documentType: 2,
      documentCountry: 1058,
      addressNumber: 123,
      addressStreet: "Test Street",
      addressCity: "Test City",
      addressState: "Test State",
      addressCountry: "Test Country",
      addressZipCode: "Test ZipCode",
      addressLatitude: 12.34,
      addressLongitude: 56.78,
      createdAt: new Date(),
      updatedAt: undefined,
      disabledAt: undefined,
    };
  });

  it("should return an empty array if no stores are found", async () => {
    queryBuilderMock.getRawMany.mockResolvedValue([]);

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return a list of stores", async () => {
    queryBuilderMock.getRawMany.mockResolvedValue([storeRow]);

    const result = await sut.execute();
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
          latitude: storeRow.addressLatitude,
          longitude: storeRow.addressLongitude,
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
