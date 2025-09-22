import { mock } from "jest-mock-extended";
import DeleteCompanyCommand from "src/domain/partner/commands/delete-company.command";
import Company from "src/domain/partner/entities/company";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import DeleteCompanyCommandHandler from "./delete-company.command-handler";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import Chain from "src/domain/partner/entities/chain";

describe("DeleteCompanyCommandHandler", () => {
  const chainRepositoryMock = mock<ChainRepository>();
  const companyRepositoryMock = mock<CompanyRepository>();

  let sut: DeleteCompanyCommandHandler;
  let command: DeleteCompanyCommand;
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

    command = new DeleteCompanyCommand(companyData.id.value);

    sut = new DeleteCompanyCommandHandler(
      companyRepositoryMock,
      chainRepositoryMock,
    );
  });

  it("should delete a company successfully", async () => {
    companyRepositoryMock.findById.mockResolvedValue(companyData);
    chainRepositoryMock.findByCompanyId.mockResolvedValue([]);

    await sut.execute(command);

    expect(companyRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      companyData,
    );
    expect(companyData.disabledAt).toBeDefined();
  });

  it("should throw an error if Company not found", async () => {
    companyRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Company with ID ${command.id} not found.`,
    );
    expect(companyRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(companyData.disabledAt).toBeUndefined();
  });

  it("should throw an error if Company has chains", async () => {
    companyRepositoryMock.findById.mockResolvedValue(companyData);
    chainRepositoryMock.findByCompanyId.mockResolvedValue([chainData]);

    await expect(sut.execute(command)).rejects.toThrow(
      `Company with ID ${command.id} has associated chains and cannot be deleted.`,
    );
    expect(companyRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(companyData.disabledAt).toBeUndefined();
  });
});
