import { mock } from "jest-mock-extended";
import UpdateCompanyCommand from "src/domain/partner/commands/update-company.command";
import Company from "src/domain/partner/entities/company";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import UpdateCompanyCommandHandler from "./update-company.command-handler";

describe("UpdateCompanyCommandHandler", () => {
  const companyRepositoryMock = mock<CompanyRepository>();

  let companyData: Company;

  beforeEach(() => {
    jest.clearAllMocks();

    companyData = new Company({
      id: ID.create().value,
      partnerId: ID.create().value,
      name: "Test Company",
      description: "Teste Company description",
      createdAt: Date.now(),
      updatedAt: undefined,
      disabledAt: undefined,
    });

    companyRepositoryMock.findById.mockResolvedValue(companyData);
    companyRepositoryMock.saveOrUpdate.mockResolvedValue(companyData);
  });

  it("should update a company successfully", async () => {
    const sut = new UpdateCompanyCommandHandler(companyRepositoryMock);

    const result = await sut.execute(
      new UpdateCompanyCommand(
        companyData.id.value,
        "Updated Test Company",
        "Updated Test Company description",
      ),
    );

    expect(companyRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      companyData,
    );
    expect(result.description).toEqual("Updated Test Company description");
    expect(result.name).toEqual("Updated Test Company");
    expect(companyData.updatedAt).toBeDefined();
  });

  it("should throw an error if Company not found", async () => {
    const sut = new UpdateCompanyCommandHandler(companyRepositoryMock);

    companyRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      sut.execute(
        new UpdateCompanyCommand(
          companyData.id.value,
          "Updated Test Company",
          "Updated Test Company description",
        ),
      ),
    ).rejects.toThrow(`Company with ID ${companyData.id.value} not found.`);
    expect(companyRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(companyData.updatedAt).toBeUndefined();
  });
});
