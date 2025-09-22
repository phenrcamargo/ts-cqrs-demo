import { mock } from "jest-mock-extended";
import UpdatePartnerCommand from "src/domain/partner/commands/update-partner.command";
import Partner from "src/domain/partner/entities/partner";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import UpdatePartnerCommandHandler from "./update-partner.command-handler";

describe("UpdatePartnerCommandHandler", () => {
  const partnerRepositoryMock = mock<PartnerRepository>();

  let partnerData: Partner;

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
      updatedAt: undefined,
      disabledAt: undefined,
    });

    partnerRepositoryMock.findById.mockResolvedValue(partnerData);
    partnerRepositoryMock.saveOrUpdate.mockResolvedValue(partnerData);
  });

  it("should update a partner successfully", async () => {
    const sut = new UpdatePartnerCommandHandler(partnerRepositoryMock);

    const result = await sut.execute(
      new UpdatePartnerCommand(
        partnerData.id.value,
        "Updated Test Partner",
        "Updated Test Partner description",
      ),
    );

    expect(partnerRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      partnerData,
    );
    expect(result.description).toEqual("Updated Test Partner description");
    expect(result.name).toEqual("Updated Test Partner");
    expect(partnerData.updatedAt).toBeDefined();
  });

  it("should throw an error if Partner not found", async () => {
    const sut = new UpdatePartnerCommandHandler(partnerRepositoryMock);

    partnerRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      sut.execute(
        new UpdatePartnerCommand(
          partnerData.id.value,
          "Updated Test Partner",
          "Updated Test Partner description",
        ),
      ),
    ).rejects.toThrow(`Partner with ID ${partnerData.id.value} not found.`);
    expect(partnerRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
    expect(partnerData.updatedAt).toBeUndefined();
  });
});
