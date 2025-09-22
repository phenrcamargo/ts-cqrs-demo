import { mock } from "jest-mock-extended";
import DeletePartnerCommand from "src/domain/partner/commands/delete-partner.command";
import Company from "src/domain/partner/entities/company";
import Partner from "src/domain/partner/entities/partner";
import { CompanyRepository } from "src/domain/partner/repositories/company.repository";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import DeletePartnerCommandHandler from "./delete-partner.command-handler";

describe("DeletePartnerCommandHandler", () => {
  const companyRepositoryMock = mock<CompanyRepository>();
  const partnerRepositoryMock = mock<PartnerRepository>();

  let sut: DeletePartnerCommandHandler;
  let command: DeletePartnerCommand;
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
      partnerId: partnerData.id.value,
      name: "Test Company",
      description: "Teste Company description",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: undefined,
    });

    command = new DeletePartnerCommand(partnerData.id.value);

    sut = new DeletePartnerCommandHandler(
      partnerRepositoryMock,
      companyRepositoryMock,
    );
  });

  it("should delete a partner successfully", async () => {
    partnerRepositoryMock.findById.mockResolvedValue(partnerData);
    companyRepositoryMock.findByPartnerId.mockResolvedValue([]);

    await sut.execute(command);

    expect(partnerRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      partnerData,
    );
    expect(partnerData.disabledAt).toBeDefined();
  });

  it("should throw an error if Partner not found", async () => {
    partnerRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Partner with ID ${command.partnerId} not found.`,
    );
    expect(partnerRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(partnerData.disabledAt).toBeUndefined();
  });

  it("should throw an error if Partner has companies", async () => {
    partnerRepositoryMock.findById.mockResolvedValue(partnerData);
    companyRepositoryMock.findByPartnerId.mockResolvedValue([companyData]);

    await expect(sut.execute(command)).rejects.toThrow(
      `Cannot delete partner with ID ${command.partnerId} because it is associated with existing companies.`,
    );
    expect(partnerRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(partnerData.disabledAt).toBeUndefined();
  });
});
