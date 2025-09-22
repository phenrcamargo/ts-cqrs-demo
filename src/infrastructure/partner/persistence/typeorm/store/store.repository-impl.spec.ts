import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { StoreOrmEntity } from "./store.orm-entity";
import StoreRepositoryImpl from "./store.repository-impl";
import { ChainOrmEntity } from "../chain/chain.orm-entity";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { AddressOrmVO } from "./address-orm-vo";
import { Document } from "src/domain/partner/value-objects/document.vo";
import Store from "src/domain/partner/entities/store";

describe("StoreRepositoryImpl", () => {
  const storeOrmRepositoryMock = mock<Repository<StoreOrmEntity>>();
  const chainOrmRepositoryMock = mock<Repository<ChainOrmEntity>>();

  let sut: StoreRepositoryImpl;
  let chainOrmEntity: ChainOrmEntity;
  let storeOrmEntity: StoreOrmEntity;

  beforeEach(() => {
    chainOrmEntity = new ChainOrmEntity();
    chainOrmEntity.id = ID.create().value;
    chainOrmEntity.companyId = ID.create().value;
    chainOrmEntity.name = "Chain Name";
    chainOrmEntity.description = "Chain description";
    chainOrmEntity.currency_code = 986;
    chainOrmEntity.country_code = 1058;
    chainOrmEntity.createdAt = new Date();

    storeOrmEntity = new StoreOrmEntity();
    storeOrmEntity.id = ID.create().value;
    storeOrmEntity.chainId = chainOrmEntity.id;
    storeOrmEntity.document = "02952561000169";
    storeOrmEntity.documentType = 2;
    storeOrmEntity.name = "Store Name";
    storeOrmEntity.description = "Store description";
    storeOrmEntity.phone = "5519999995623";
    storeOrmEntity.address = new AddressOrmVO();
    storeOrmEntity.address.number = 792;
    storeOrmEntity.address.street = "Store Street";
    storeOrmEntity.address.city = "Store City";
    storeOrmEntity.address.state = "Store State";
    storeOrmEntity.address.country = "Store Country";
    storeOrmEntity.address.zipCode = "12345";
    storeOrmEntity.createdAt = new Date();

    sut = new StoreRepositoryImpl(
      storeOrmRepositoryMock,
      chainOrmRepositoryMock,
    );
  });

  describe(StoreRepositoryImpl.prototype.findById.name, () => {
    it("should return undefined if store not found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });

    it("shoud throw an error if Chain not found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(storeOrmEntity);
      chainOrmRepositoryMock.findOne.mockResolvedValue(null);

      await expect(sut.findById(ID.create())).rejects.toThrow(
        `Chain with ID ${chainOrmEntity.id} not found.`,
      );
    });

    it("should return the store if found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(storeOrmEntity);
      chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);

      const result = await sut.findById(ID.create());

      expect(result?.id.value).toEqual(storeOrmEntity.id);
      expect(result?.name.value).toEqual(storeOrmEntity.name);
      expect(result?.chainId.value).toEqual(storeOrmEntity.chainId);
      expect(result?.document.value).toEqual(storeOrmEntity.document);
      expect(result?.createdAt).toEqual(storeOrmEntity.createdAt.getTime());
      expect(result?.updatedAt).toEqual(storeOrmEntity.updatedAt?.getTime());
      expect(result?.disabledAt).toEqual(storeOrmEntity.disabledAt?.getTime());
    });
  });

  describe(StoreRepositoryImpl.prototype.findByDocument.name, () => {
    it("should return undefined if store not found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findByDocument(
        Document.create({
          value: "02952561000169",
          countryCode: 1058,
          typeCode: 2,
        }),
      );

      expect(result).toBeUndefined();
    });

    it("shoud throw an error if Chain not found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(storeOrmEntity);
      chainOrmRepositoryMock.findOne.mockResolvedValue(null);

      const document = Document.create({
        value: "02952561000169",
        countryCode: 1058,
        typeCode: 2,
      });

      await expect(sut.findByDocument(document)).rejects.toThrow(
        `Chain with ID ${chainOrmEntity.id} not found.`,
      );
    });

    it("should return the store if found", async () => {
      storeOrmRepositoryMock.findOne.mockResolvedValue(storeOrmEntity);
      chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);

      const result = await sut.findByDocument(
        Document.create({
          value: "02952561000169",
          countryCode: 1058,
          typeCode: 2,
        }),
      );

      expect(result?.id.value).toEqual(storeOrmEntity.id);
      expect(result?.name.value).toEqual(storeOrmEntity.name);
      expect(result?.chainId.value).toEqual(storeOrmEntity.chainId);
      expect(result?.document.value).toEqual(storeOrmEntity.document);
      expect(result?.createdAt).toEqual(storeOrmEntity.createdAt.getTime());
      expect(result?.updatedAt).toEqual(storeOrmEntity.updatedAt?.getTime());
      expect(result?.disabledAt).toEqual(storeOrmEntity.disabledAt?.getTime());
    });
  });

  describe(StoreRepositoryImpl.prototype.findByChainId.name, () => {
    it("should throw an error if Chain not found", async () => {
      chainOrmRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        sut.findByChainId(ID.create(chainOrmEntity.id)),
      ).rejects.toThrow(`Chain with ID ${chainOrmEntity.id} not found.`);
    });

    it("should return an empty array if no stores found", async () => {
      chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);
      storeOrmRepositoryMock.find.mockResolvedValue([]);

      const result = await sut.findByChainId(ID.create(chainOrmEntity.id));

      expect(result).toEqual([]);
    });

    it("should return the stores if found", async () => {
      chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);
      storeOrmRepositoryMock.find.mockResolvedValue([storeOrmEntity]);

      const result = await sut.findByChainId(ID.create(chainOrmEntity.id));

      expect(result).toHaveLength(1);
      expect(result[0].id.value).toEqual(storeOrmEntity.id);
      expect(result[0].name.value).toEqual(storeOrmEntity.name);
      expect(result[0].chainId.value).toEqual(storeOrmEntity.chainId);
      expect(result[0].document.value).toEqual(storeOrmEntity.document);
      expect(result[0].createdAt).toEqual(storeOrmEntity.createdAt.getTime());
      expect(result[0].updatedAt).toEqual(storeOrmEntity.updatedAt?.getTime());
      expect(result[0].disabledAt).toEqual(
        storeOrmEntity.disabledAt?.getTime(),
      );
    });
  });

  describe(StoreRepositoryImpl.prototype.saveOrUpdate.name, () => {
    it("should save or update the store", async () => {
      storeOrmRepositoryMock.save.mockResolvedValue(storeOrmEntity);

      const store = new Store({
        id: storeOrmEntity.id,
        chainId: chainOrmEntity.id,
        chainCountryCode: chainOrmEntity.country_code,
        document: storeOrmEntity.document,
        documentTypeCode: storeOrmEntity.documentType,
        name: storeOrmEntity.name,
        description: storeOrmEntity.description,
        phone: storeOrmEntity.phone,
        address: {
          number: storeOrmEntity.address.number,
          street: storeOrmEntity.address.street,
          city: storeOrmEntity.address.city,
          state: storeOrmEntity.address.state,
          country: storeOrmEntity.address.country,
          zipCode: storeOrmEntity.address.zipCode,
          latitude: storeOrmEntity.address.latitude,
          longitude: storeOrmEntity.address.longitude,
        },
        createdAt: storeOrmEntity.createdAt.getTime(),
      });

      const result = await sut.saveOrUpdate(store);

      expect(result.id.value).toEqual(storeOrmEntity.id);
      expect(result.name.value).toEqual(storeOrmEntity.name);
      expect(result.chainId.value).toEqual(storeOrmEntity.chainId);
      expect(result.document.value).toEqual(storeOrmEntity.document);
      expect(result.createdAt).toEqual(storeOrmEntity.createdAt.getTime());
      expect(result.updatedAt).toEqual(storeOrmEntity.updatedAt?.getTime());
      expect(result.disabledAt).toEqual(storeOrmEntity.disabledAt?.getTime());
    });
  });
});
