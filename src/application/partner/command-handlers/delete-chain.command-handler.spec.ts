import { mock } from "jest-mock-extended";
import DeleteChainCommand from "src/domain/partner/commands/delete-chain.command";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import DeleteChainCommandHandler from "./delete-chain.command-handler";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";
import Chain from "src/domain/partner/entities/chain";
import Store from "src/domain/partner/entities/store";

describe("DeleteChainCommandHandler", () => {
  const storeRepositoryMock = mock<StoreRepository>();
  const chainRepositoryMock = mock<ChainRepository>();

  let sut: DeleteChainCommandHandler;
  let command: DeleteChainCommand;
  let chainData: Chain;
  let storeData: Store;

  beforeEach(() => {
    jest.clearAllMocks();

    chainData = new Chain({
      id: ID.create().value,
      companyId: ID.create().value,
      name: "Test Chain",
      description: "A chain for testing",
      currencyCode: 986,
      countryCode: 1058,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    storeData = new Store({
      id: ID.create().value,
      chainId: chainData.id.value,
      chainCountryCode: chainData.countryCode,
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

    command = new DeleteChainCommand(chainData.id.value);

    sut = new DeleteChainCommandHandler(
      chainRepositoryMock,
      storeRepositoryMock,
    );
  });

  it("should delete a chain successfully", async () => {
    chainRepositoryMock.findById.mockResolvedValue(chainData);
    storeRepositoryMock.findByChainId.mockResolvedValue([]);

    await sut.execute(command);

    expect(chainRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(chainData);
    expect(chainData.disabledAt).toBeDefined();
  });

  it("should throw an error if Chain not found", async () => {
    chainRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Chain with ID ${command.chainId} not found.`,
    );
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(chainData.disabledAt).toBeUndefined();
  });

  it("should throw an error if Chain has stores", async () => {
    chainRepositoryMock.findById.mockResolvedValue(chainData);
    storeRepositoryMock.findByChainId.mockResolvedValue([storeData]);

    await expect(sut.execute(command)).rejects.toThrow(
      `Chain with ID ${command.chainId} has associated stores and cannot be deleted.`,
    );
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(chainData.disabledAt).toBeUndefined();
  });
});
