process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Document } from "src/domain/partner/value-objects/document.vo";
import Store from "src/domain/partner/entities/store";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import { AddressOrmVO } from "src/infrastructure/partner/persistence/typeorm/store/address-orm-vo";
import { StoreOrmEntity } from "src/infrastructure/partner/persistence/typeorm/store/store.orm-entity";
import StoreRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/store/store.repository-impl";

describe("StoreRepositoryImpl (integration, sqlite in-memory)", () => {
  let sut: StoreRepositoryImpl;
  let storeOrmRepository: Repository<StoreOrmEntity>;
  let chainOrmRepository: Repository<ChainOrmEntity>;

  let dataSource: DataSource;
  let chainOrmEntity: ChainOrmEntity;
  let storeOrmEntity: StoreOrmEntity;

  beforeAll(async () => {
    const moduleTest = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: "core",
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [StoreOrmEntity, ChainOrmEntity],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([StoreOrmEntity, ChainOrmEntity], "core"),
      ],
      providers: [StoreRepositoryImpl],
    }).compile();

    sut = moduleTest.get<StoreRepositoryImpl>(StoreRepositoryImpl);
    dataSource = moduleTest.get<DataSource>(getDataSourceToken("core"));
    storeOrmRepository = moduleTest.get(
      getRepositoryToken(StoreOrmEntity, dataSource),
    );
    chainOrmRepository = moduleTest.get(
      getRepositoryToken(ChainOrmEntity, dataSource),
    );
  });

  beforeEach(async () => {
    await storeOrmRepository.clear();
    await chainOrmRepository.clear();

    chainOrmEntity = chainOrmRepository.create({
      id: ID.create().value,
      companyId: ID.create().value,
      name: "Chain Name",
      description: "Chain description",
      currency_code: 986,
      country_code: 1058,
      createdAt: new Date(),
    });
    await chainOrmRepository.save(chainOrmEntity);

    storeOrmEntity = storeOrmRepository.create({
      id: ID.create().value,
      chainId: chainOrmEntity.id,
      document: "02952561000169",
      documentType: 2,
      name: "Store Name",
      description: "Store description",
      phone: "5519999995623",
      address: {
        number: 792,
        street: "Store Street",
        city: "Store City",
        state: "Store State",
        country: "Store Country",
        zipCode: "12345",
      } as AddressOrmVO,
      createdAt: new Date(),
    });
    await storeOrmRepository.save(storeOrmEntity);
  });

  describe("findById", () => {
    it("should return undefined if store not found", async () => {
      const result = await sut.findById(ID.create());
      expect(result).toBeUndefined();
    });

    it("should throw an error if Chain not found", async () => {
      await chainOrmRepository.clear();

      await expect(sut.findById(ID.create(storeOrmEntity.id))).rejects.toThrow(
        `Chain with ID ${chainOrmEntity.id} not found.`,
      );
    });

    it("should return store if found", async () => {
      const result = await sut.findById(ID.create(storeOrmEntity.id));
      expect(result?.id.value).toEqual(storeOrmEntity.id);
      expect(result?.name.value).toEqual(storeOrmEntity.name);
    });
  });

  describe("findByDocument", () => {
    it("should return undefined if not found", async () => {
      const result = await sut.findByDocument(
        Document.create({
          value: "99999999999999",
          countryCode: 1058,
          typeCode: 2,
        }),
      );
      expect(result).toBeUndefined();
    });

    it("should throw an error if Chain not found", async () => {
      await chainOrmRepository.clear();
      const document = Document.create({
        value: storeOrmEntity.document,
        countryCode: chainOrmEntity.country_code,
        typeCode: storeOrmEntity.documentType,
      });

      await expect(sut.findByDocument(document)).rejects.toThrow(
        `Chain with ID ${chainOrmEntity.id} not found.`,
      );
    });

    it("should return store if found", async () => {
      const document = Document.create({
        value: storeOrmEntity.document,
        countryCode: chainOrmEntity.country_code,
        typeCode: storeOrmEntity.documentType,
      });
      const result = await sut.findByDocument(document);
      expect(result?.id.value).toEqual(storeOrmEntity.id);
      expect(result?.document.value).toEqual(storeOrmEntity.document);
    });
  });

  describe("findByChainId", () => {
    it("should return stores if found", async () => {
      const result = await sut.findByChainId(ID.create(chainOrmEntity.id));
      expect(result).toHaveLength(1);
      expect(result[0].id.value).toEqual(storeOrmEntity.id);
    });

    it("should throw an error if chain not found", async () => {
      await chainOrmRepository.clear();

      await expect(
        sut.findByChainId(ID.create(chainOrmEntity.id)),
      ).rejects.toThrow(`Chain with ID ${chainOrmEntity.id} not found.`);
    });

    it("should return an empty array if no stores found", async () => {
      await storeOrmRepository.clear();
      const result = await sut.findByChainId(ID.create(chainOrmEntity.id));

      expect(result).toEqual([]);
    });
  });

  describe("saveOrUpdate", () => {
    it("should persist and return the store", async () => {
      const newStore = new Store({
        id: ID.create().value,
        chainId: chainOrmEntity.id,
        chainCountryCode: chainOrmEntity.country_code,
        document: "12345678901234",
        documentTypeCode: 2,
        name: "Another Store",
        description: "Another Store Description",
        phone: "5511111111111",
        address: {
          number: 100,
          street: "X Street",
          city: "Y City",
          state: "SP",
          country: "BR",
          zipCode: "54321",
        },
        createdAt: Date.now(),
      });

      const result = await sut.saveOrUpdate(newStore);
      expect(result.id.value).toEqual(newStore.id.value);

      const persisted = await sut.findById(result.id);
      expect(persisted?.name.value).toEqual("Another Store");
    });

    it("should update and return the store", async () => {
      const store = await sut.findById(ID.create(storeOrmEntity.id));
      expect(store).toBeDefined();
      expect(store!.updatedAt).toBeUndefined();

      store!.updateDetails({
        name: "Updated Store Name",
        description: "Updated Store Description",
      });

      const result = await sut.saveOrUpdate(store!);
      expect(result.id.value).toEqual(storeOrmEntity.id);
      expect(result.name.value).toEqual("Updated Store Name");
      expect(result.description.value).toEqual("Updated Store Description");
      expect(result.updatedAt).toBeDefined();
    });
  });
});
