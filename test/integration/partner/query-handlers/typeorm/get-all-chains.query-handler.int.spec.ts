process.env.DB_TYPE = "sqlite";

import { DataSource, Repository } from "typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import { GetAllChainsQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-all-chains.query-handler";

describe("GetAllChainsQueryHandler", () => {
  let sut: GetAllChainsQueryHandler;
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
      providers: [GetAllChainsQueryHandler],
    }).compile();

    sut = moduleTest.get<GetAllChainsQueryHandler>(GetAllChainsQueryHandler);
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

  it("should return an empty array if no chains are found", async () => {
    await chainOrmRepository.clear();

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of chains", async () => {
    const result = await sut.execute();
    expect(result).toEqual([
      {
        id: chainOrmEntity.id,
        companyId: chainOrmEntity.companyId,
        name: chainOrmEntity.name,
        description: chainOrmEntity.description,
        currency_code: chainOrmEntity.currency_code,
        country_code: chainOrmEntity.country_code,
        createdAt: chainOrmEntity.createdAt,
        updatedAt: chainOrmEntity.updatedAt,
        disabledAt: chainOrmEntity.disabledAt,
      },
    ]);
  });
});
