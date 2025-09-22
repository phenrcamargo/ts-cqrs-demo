process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository, DataSource } from "typeorm";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import ChainRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/chain/chain.repository-impl";
import Chain from "src/domain/partner/entities/chain";

describe("ChainRepositoryImpl", () => {
  let sut: ChainRepositoryImpl;
  let chainOrmRepository: Repository<ChainOrmEntity>;

  let dataSource: DataSource;
  let chainOrmEntity: ChainOrmEntity;

  beforeAll(async () => {
    const moduleTest = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: "core",
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [ChainOrmEntity],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([ChainOrmEntity], "core"),
      ],
      providers: [ChainRepositoryImpl],
    }).compile();

    sut = moduleTest.get<ChainRepositoryImpl>(ChainRepositoryImpl);
    dataSource = moduleTest.get<DataSource>(getDataSourceToken("core"));
    chainOrmRepository = moduleTest.get(
      getRepositoryToken(ChainOrmEntity, dataSource),
    );
  });

  beforeEach(async () => {
    await chainOrmRepository.clear();

    chainOrmEntity = chainOrmRepository.create({
      id: ID.create().value,
      companyId: ID.create().value,
      name: "Chain Name",
      description: "Chain description",
      currency_code: 840,
      country_code: 2496,
      createdAt: new Date(),
    });
    await chainOrmRepository.save(chainOrmEntity);
  });

  describe(ChainRepositoryImpl.prototype.findById.name, () => {
    it("should return a chain by id", async () => {
      const result = await sut.findById(ID.create(chainOrmEntity.id));

      expect(result?.companyId.value).toEqual(chainOrmEntity.companyId);
      expect(result?.name.value).toEqual(chainOrmEntity.name);
      expect(result?.description.value).toEqual(chainOrmEntity.description);
      expect(result?.currencyCode).toEqual(chainOrmEntity.currency_code);
      expect(result?.countryCode).toEqual(chainOrmEntity.country_code);
      expect(result?.createdAt).toEqual(chainOrmEntity.createdAt.getTime());
    });

    it("should return undefined if chain is not found", async () => {
      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });
  });

  describe(ChainRepositoryImpl.prototype.findByCompanyId.name, () => {
    it("should return a chain by company id", async () => {
      const result = await sut.findByCompanyId(
        ID.create(chainOrmEntity.companyId),
      );

      expect(result[0]?.companyId.value).toEqual(chainOrmEntity.companyId);
      expect(result[0]?.name.value).toEqual(chainOrmEntity.name);
      expect(result[0]?.description.value).toEqual(chainOrmEntity.description);
      expect(result[0]?.currencyCode).toEqual(chainOrmEntity.currency_code);
      expect(result[0]?.countryCode).toEqual(chainOrmEntity.country_code);
      expect(result[0]?.createdAt).toEqual(chainOrmEntity.createdAt.getTime());
    });

    it("should return an empty array if chain is not found", async () => {
      const result = await sut.findByCompanyId(ID.create());

      expect(result).toEqual([]);
    });
  });

  describe(ChainRepositoryImpl.prototype.saveOrUpdate.name, () => {
    it("should persist a new chain", async () => {
      const newChain = new Chain({
        id: ID.create().value,
        companyId: ID.create().value,
        name: "New Chain",
        description: "New Chain Description",
        currencyCode: 840,
        countryCode: 2496,
        createdAt: Date.now(),
      });

      const result = await sut.saveOrUpdate(newChain);
      expect(result.id.value).toEqual(newChain.id.value);
    });

    it("should update an existing chain", async () => {
      const chain = await sut.findById(ID.create(chainOrmEntity.id));
      expect(chain).toBeDefined();
      expect(chain!.updatedAt).toBeUndefined();

      chain!.updateDetails({
        name: "Updated Name",
        description: "Updated Description",
      });

      const updatedResult = await sut.saveOrUpdate(chain!);

      expect(updatedResult.name.value).toEqual("Updated Name");
      expect(updatedResult.description.value).toEqual("Updated Description");
      expect(updatedResult.updatedAt).toBeDefined();
    });
  });
});
