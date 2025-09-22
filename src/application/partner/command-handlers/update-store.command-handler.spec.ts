import { mock } from "jest-mock-extended";
import UpdateStoreCommand from "src/domain/partner/commands/update-store.command";
import Store from "src/domain/partner/entities/store";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import UpdateStoreCommandHandler from "./update-store.command-handler";

describe("UpdateStoreCommandHandler", () => {
  const storeRepositoryMock = mock<StoreRepository>();

  let storeData: Store;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = new Store({
      id: ID.create().value,
      chainId: ID.create().value,
      chainCountryCode: 1058,
      document: "02952561000469",
      documentTypeCode: 2,
      name: "Test Store",
      description: "Test Store Description",
      phone: "5519999895632",
      address: {
        number: 123,
        street: "Test Street",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        zipCode: "12345-678",
      },
      createdAt: Date.now(),
      updatedAt: undefined,
      disabledAt: undefined,
    });

    storeRepositoryMock.findById.mockResolvedValue(storeData);
    storeRepositoryMock.saveOrUpdate.mockResolvedValue(storeData);
  });

  it("should update a store successfully", async () => {
    const sut = new UpdateStoreCommandHandler(storeRepositoryMock);

    const result = await sut.execute(
      new UpdateStoreCommand(
        storeData.id.value,
        "Updated Test Store",
        "Updated Test Store description",
      ),
    );

    expect(storeRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(storeData);
    expect(result.description).toEqual("Updated Test Store description");
    expect(result.name).toEqual("Updated Test Store");
    expect(storeData.updatedAt).toBeDefined();
  });

  it("should throw an error if Store not found", async () => {
    const sut = new UpdateStoreCommandHandler(storeRepositoryMock);

    storeRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      sut.execute(
        new UpdateStoreCommand(
          storeData.id.value,
          "Updated Test Store",
          "Updated Test Store description",
        ),
      ),
    ).rejects.toThrow(`Store with ID ${storeData.id.value} not found.`);
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(storeData.updatedAt).toBeUndefined();
  });
});
