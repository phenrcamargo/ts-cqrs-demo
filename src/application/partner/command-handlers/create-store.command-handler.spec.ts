import { mock } from "jest-mock-extended";
import CreateStoreCommand from "src/domain/partner/commands/create-store.command";
import Chain from "src/domain/partner/entities/chain";
import Store from "src/domain/partner/entities/store";
import { ChainRepository } from "src/domain/partner/repositories/chain.repository";
import { StoreRepository } from "src/domain/partner/repositories/store.repository";
import { ID } from "src/domain/partner/value-objects/id.vo";
import CreateStoreCommandHandler from "./create-store.command-handler";
import Partner from "src/domain/partner/entities/partner";
import { PartnerRepository } from "src/domain/partner/repositories/partner.repository";

describe("CreateStoreCommandHandler", () => {
  const partnerRepositoryMock = mock<PartnerRepository>();
  const chainRepositoryMock = mock<ChainRepository>();
  const storeRepositoryMock = mock<StoreRepository>();

  let sut: CreateStoreCommandHandler;
  let partnerData: Partner;
  let chainData: Chain;
  let storeData: Store;
  let command: CreateStoreCommand;

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

    command = new CreateStoreCommand(
      chainData.id.value,
      storeData.document.value,
      storeData.document.type,
      storeData.name.value,
      storeData.phone.value,
      {
        number: storeData.address.number,
        street: storeData.address.street,
        city: storeData.address.city,
        state: storeData.address.state,
        country: storeData.address.country,
        zipCode: storeData.address.zipCode,
        latitude: storeData.address.latitude,
        longitude: storeData.address.longitude,
      },
      storeData.description.value,
    );

    partnerRepositoryMock.saveOrUpdate.mockResolvedValue(partnerData);
    partnerRepositoryMock.findByDocument.mockResolvedValue(undefined);
    chainRepositoryMock.findById.mockResolvedValue(chainData);
    storeRepositoryMock.saveOrUpdate.mockResolvedValue(storeData);
    storeRepositoryMock.findByDocument.mockResolvedValue(undefined);

    sut = new CreateStoreCommandHandler(
      partnerRepositoryMock,
      chainRepositoryMock,
      storeRepositoryMock,
    );
  });

  it("should create a store successfully", async () => {
    const result = await sut.execute(command);

    expect(result).toEqual(storeData.id.value);
    expect(storeRepositoryMock.saveOrUpdate).toHaveBeenCalledWith(storeData);
  });

  it("should throw an error if Command has an invalid document type", async () => {
    command = new CreateStoreCommand(
      chainData.id.value,
      storeData.document.value,
      9999,
      storeData.name.value,
      storeData.phone.value,
      {
        number: storeData.address.number,
        street: storeData.address.street,
        city: storeData.address.city,
        state: storeData.address.state,
        country: storeData.address.country,
        zipCode: storeData.address.zipCode,
        latitude: storeData.address.latitude,
        longitude: storeData.address.longitude,
      },
      storeData.description.value,
    );

    await expect(sut.execute(command)).rejects.toThrow(
      `Invalid document type code: ${command.documentTypeCode}`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if Store already exists", async () => {
    storeRepositoryMock.findByDocument.mockResolvedValue(storeData);

    await expect(sut.execute(command)).rejects.toThrow(
      `Store with document ${storeData.document.value} already exists.`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if Chain is disabled", async () => {
    chainData.delete();
    chainRepositoryMock.findById.mockResolvedValue(chainData);

    await expect(sut.execute(command)).rejects.toThrow(
      `Chain with ID ${chainData.id.value} is disabled.`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if Chain not found", async () => {
    chainRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(sut.execute(command)).rejects.toThrow(
      `Chain with ID ${chainData.id.value} not found.`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if exists Partner with same document", async () => {
    partnerRepositoryMock.findByDocument.mockResolvedValue(partnerData);

    await expect(sut.execute(command)).rejects.toThrow(
      `Partner with document ${partnerData.document.value} already exists.`,
    );
    expect(storeRepositoryMock.saveOrUpdate).not.toHaveBeenCalled();
  });
});
