import { mock } from "jest-mock-extended";
import Chain from "src/domain/partner/entities/chain";
import Company from "src/domain/partner/entities/company";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import CreateChainCommandHandler from "./create-chain.command-handler";
import CreateChainCommand from "src/domain/partner/commands/create-chain.command";

describe("CreateChainCommandHandler", () => {
  const chainRepositoryMock = mock<ChainRepository>();
  const companyRepositoryMock = mock<CompanyRepository>();

  let companyData: Company;
  let chainData: Chain;

  beforeEach(() => {
    jest.clearAllMocks();

    companyData = new Company({
      id: ID.create().value,
      partnerId: ID.create().value,
      name: "Test Company",
      description: "Teste Company description",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    chainData = new Chain({
      id: ID.create().value,
      companyId: companyData.id.value,
      name: "Test Chain",
      description: "A chain for testing",
      currencyCode: 986,
      countryCode: 1058,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    companyRepositoryMock.findById.mockResolvedValue(companyData);
    chainRepositoryMock.saveOrUpdate.mockResolvedValue(chainData);
  });

  it("should create a chain successfully", async () => {
    const sut = new CreateChainCommandHandler(
      chainRepositoryMock,
      companyRepositoryMock,
    );

    const result = await sut.execute(
      new CreateChainCommand(
        companyData.id.value,
        chainData.name.value,
        chainData.currencyCode,
        chainData.countryCode,
        chainData.description.value,
      ),
    );

    expect(result).toEqual(chainData.id.value);
    expect(chainRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(chainData);
  });

  it("should throw an error if Command has an invalid country code", async () => {
    const sut = new CreateChainCommandHandler(
      chainRepositoryMock,
      companyRepositoryMock,
    );

    await expect(
      sut.execute(
        new CreateChainCommand(
          companyData.id.value,
          chainData.name.value,
          chainData.currencyCode,
          9999,
          chainData.description.value,
        ),
      ),
    ).rejects.toThrow("Invalid country code: 9999");
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if Command has an invalid currency code", async () => {
    const sut = new CreateChainCommandHandler(
      chainRepositoryMock,
      companyRepositoryMock,
    );

    await expect(
      sut.execute(
        new CreateChainCommand(
          companyData.id.value,
          chainData.name.value,
          9999,
          chainData.countryCode,
          chainData.description.value,
        ),
      ),
    ).rejects.toThrow("Invalid currency code: 9999");
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if company is not found", async () => {
    const sut = new CreateChainCommandHandler(
      chainRepositoryMock,
      companyRepositoryMock,
    );

    companyRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      sut.execute(
        new CreateChainCommand(
          companyData.id.value,
          chainData.name.value,
          chainData.currencyCode,
          chainData.countryCode,
          chainData.description.value,
        ),
      ),
    ).rejects.toThrow(`Company with ID ${companyData.id.value} not found.`);
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if company is disabled", async () => {
    const sut = new CreateChainCommandHandler(
      chainRepositoryMock,
      companyRepositoryMock,
    );

    companyData.delete();
    companyRepositoryMock.findById.mockResolvedValue(companyData);

    await expect(
      sut.execute(
        new CreateChainCommand(
          companyData.id.value,
          chainData.name.value,
          chainData.currencyCode,
          chainData.countryCode,
          chainData.description.value,
        ),
      ),
    ).rejects.toThrow(`Company with ID ${companyData.id.value} is disabled.`);
    expect(chainRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });
});
