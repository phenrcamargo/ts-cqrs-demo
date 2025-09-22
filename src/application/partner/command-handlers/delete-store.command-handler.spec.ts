import { mock } from "jest-mock-extended";
import DeleteStoreCommand from "src/domain/partner/commands/delete-store.command";
import Store from "src/domain/partner/entities/store";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import DeleteStoreCommandHandler from "./delete-store.command-handler";

describe("DeleteStoreCommandHandler", () => {
  const storeRepositoryMock = mock<StoreRepository>();

  let sut: DeleteStoreCommandHandler;
  let command: DeleteStoreCommand;
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
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    command = new DeleteStoreCommand(storeData.id.value);

    sut = new DeleteStoreCommandHandler(storeRepositoryMock);
  });

  it("should delete a store successfully", async () => {
    storeRepositoryMock.findById.mockResolvedValue(storeData);

    await sut.execute(command);

    expect(storeRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(storeData);
    expect(storeData.disabledAt).toBeDefined();
  });

  it("should throw an error if Store not found", async () => {
    storeRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Store with ID ${command.storeId} not found.`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(storeData.disabledAt).toBeUndefined();
  });
});
