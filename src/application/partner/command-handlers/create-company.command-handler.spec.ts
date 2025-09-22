import { mock } from "jest-mock-extended";
import Company from "src/domain/partner/entities/company";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import CreateCompanyCommandHandler from "./create-company.command-handler";
import CreateCompanyCommand from "src/domain/partner/commands/create-company.command";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";
import Partner from "src/domain/partner/entities/partner";

describe("CreateCompanyCommandHandler", () => {
  const partnerRepositoryMock = mock<PartnerRepository>();
  const companyRepositoryMock = mock<CompanyRepository>();

  let partnerData: Partner;
  let companyData: Company;

  beforeEach(() => {
    jest.clearAllMocks();

    partnerData = new Partner({
      id: ID.create().value,
      document: "02952561000469",
      documentTypeCode: 2,
      countryCode: 1058,
      name: "Test Partner",
      description: "Test Partner description",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    companyData = new Company({
      id: ID.create().value,
      partnerId: ID.create().value,
      name: "Test Company",
      description: "Teste Company description",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    partnerRepositoryMock.findById.mockResolvedValue(partnerData);
    companyRepositoryMock.saveOrUpdate.mockResolvedValue(companyData);
  });

  it("should create a company successfully", async () => {
    const sut = new CreateCompanyCommandHandler(
      companyRepositoryMock,
      partnerRepositoryMock,
    );

    const result = await sut.execute(
      new CreateCompanyCommand(
        partnerData.id.value,
        companyData.name.value,
        companyData.description.value,
      ),
    );

    expect(result).toEqual(companyData.id.value);
    expect(companyRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      companyData,
    );
  });

  it("should throw an error if Partner not found", async () => {
    const sut = new CreateCompanyCommandHandler(
      companyRepositoryMock,
      partnerRepositoryMock,
    );

    partnerRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      sut.execute(
        new CreateCompanyCommand(
          partnerData.id.value,
          companyData.name.value,
          companyData.description.value,
        ),
      ),
    ).rejects.toThrow(`Partner with ID ${partnerData.id.value} not found.`);
  });

  it("should throw an error if Partner is disabled", async () => {
    const sut = new CreateCompanyCommandHandler(
      companyRepositoryMock,
      partnerRepositoryMock,
    );

    partnerData.delete();
    partnerRepositoryMock.findById.mockResolvedValue(partnerData);

    await expect(
      sut.execute(
        new CreateCompanyCommand(
          partnerData.id.value,
          companyData.name.value,
          companyData.description.value,
        ),
      ),
    ).rejects.toThrow(`Partner with ID ${partnerData.id.value} is disabled.`);
  });
});
