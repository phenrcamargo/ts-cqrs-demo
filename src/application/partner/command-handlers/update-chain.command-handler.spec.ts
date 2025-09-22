import { mock } from "jest-mock-extended";
import UpdateChainCommand from "src/domain/partner/commands/update-chain.command";
import Chain from "src/domain/partner/entities/chain";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import UpdateChainCommandHandler from "./update-chain.command-handler";

describe("UpdateChainCommandHandler", () => {
  const chainRepositoryMock = mock<ChainRepository>();

  let sut: UpdateChainCommandHandler;
  let command: UpdateChainCommand;
  let chainData: Chain;

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
      updatedAt: undefined,
      disabledAt: undefined,
    });

    command = new UpdateChainCommand(
      chainData.id.value,
      "Updated Test Chain",
      "Updated Test Chain Description",
      840,
      2496,
    );

    sut = new UpdateChainCommandHandler(chainRepositoryMock);
  });

  it("should update a chain successfully", async () => {
    chainRepositoryMock.findById.mockResolvedValue(chainData);
    chainRepositoryMock.saveOrUpdate.mockResolvedValue(chainData);

    const result = await sut.execute(command);

    expect(chainRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(chainData);
    expect(result.name).toBe(command.name);
    expect(result.description).toBe(command.description);
    expect(result.currencyCode).toBe(command.currencyCode);
    expect(result.countryCode).toBe(command.countryCode);
    expect(chainData.updatedAt).toBeDefined();
  });

  it("should throw an error if Command has an invalid country code", async () => {
    command = new UpdateChainCommand(
      chainData.id.value,
      "Updated Test Chain",
      "Updated Test Chain Description",
      840,
      9999,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Invalid country code: ${command.countryCode}`,
    );
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(chainData.updatedAt).toBeUndefined();
  });

  it("should throw an error if Command has an invalid currency code", async () => {
    command = new UpdateChainCommand(
      chainData.id.value,
      "Updated Test Chain",
      "Updated Test Chain Description",
      9999,
      2496,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Invalid currency code: ${command.currencyCode}`,
    );
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(chainData.updatedAt).toBeUndefined();
  });

  it("should throw an error if Chain not found", async () => {
    chainRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Chain with ID ${command.chainId} not found.`,
    );
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(chainData.updatedAt).toBeUndefined();
  });
});
