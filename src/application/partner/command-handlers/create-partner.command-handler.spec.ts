import { mock } from "jest-mock-extended";
import Partner from "src/domain/partner/entities/partner";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import CreatePartnerCommandHandler from "./create-partner.command-handler";
import CreatePartnerCommand from "src/domain/partner/commands/create-partner.command";
import Store from "src/domain/partner/entities/store";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";

describe("CreatePartnerCommandHandler", () => {
  const partnerRepositoryMock = mock<PartnerRepository>();
  const storeRepositoryMock = mock<StoreRepository>();

  let sut: CreatePartnerCommandHandler;
  let command: CreatePartnerCommand;
  let partnerData: Partner;
  let storeData: Store;

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

    partnerRepositoryMock.saveOrUpdate.mockResolvedValue(partnerData);
    partnerRepositoryMock.findByDocument.mockResolvedValue(undefined);
    storeRepositoryMock.saveOrUpdate.mockResolvedValue(storeData);
    storeRepositoryMock.findByDocument.mockResolvedValue(undefined);

    sut = new CreatePartnerCommandHandler(
      partnerRepositoryMock,
      storeRepositoryMock,
    );
  });

  it("should create a partner successfully", async () => {
    const sut = new CreatePartnerCommandHandler(
      partnerRepositoryMock,
      storeRepositoryMock,
    );

    command = new CreatePartnerCommand(
      partnerData.document.value,
      partnerData.document.type,
      partnerData.document.country,
      partnerData.name.value,
      partnerData.description.value,
    );

    const result = await sut.execute(command);

    expect(result).toEqual(partnerData.id.value);
    expect(partnerRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(
      partnerData,
    );
  });

  it("should throw an error if Command has an invalid country code", async () => {
    const sut = new CreatePartnerCommandHandler(
      partnerRepositoryMock,
      storeRepositoryMock,
    );

    command = new CreatePartnerCommand(
      partnerData.document.value,
      partnerData.document.type,
      9999,
      partnerData.name.value,
      partnerData.description.value,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Invalid country code: 9999`,
    );
  });

  it("should throw an error if Command has an invalid document type code", async () => {
    command = new CreatePartnerCommand(
      partnerData.document.value,
      9999,
      partnerData.document.country,
      partnerData.name.value,
      partnerData.description.value,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Invalid document type code: 9999`,
    );
  });

  it("should throw an error if Partner already exists", async () => {
    partnerRepositoryMock.findByDocument.mockResolvedValue(partnerData);

    command = new CreatePartnerCommand(
      partnerData.document.value,
      partnerData.document.type,
      partnerData.document.country,
      partnerData.name.value,
      partnerData.description.value,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Partner with document ${partnerData.document.value} already exists.`,
    );
  });

  it("should throw an error if Store with same document exists", async () => {
    storeRepositoryMock.findByDocument.mockResolvedValue(storeData);

    command = new CreatePartnerCommand(
      partnerData.document.value,
      partnerData.document.type,
      partnerData.document.country,
      partnerData.name.value,
      partnerData.description.value,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Store with document ${storeData.document.value} already exists.`,
    );
  });
});
