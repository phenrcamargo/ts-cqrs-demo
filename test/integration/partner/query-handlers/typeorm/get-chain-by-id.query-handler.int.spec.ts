process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { GetChainByIdQuery } from "src/application/partner/queries/get-chain-by-id.query";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import { GetChainByIdQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-chain-by-id.query-handler";
import { DataSource, Repository } from "typeorm";

describe("GetChainByIdQueryHandler", () => {
  let sut: GetChainByIdQueryHandler;
  let query: GetChainByIdQuery;

  let dataSource: DataSource;
  let chainOrmEntity: ChainOrmEntity;
  let chainOrmRepository: Repository<ChainOrmEntity>;

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
      providers: [GetChainByIdQueryHandler],
    }).compile();

    sut = moduleTest.get<GetChainByIdQueryHandler>(GetChainByIdQueryHandler);
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

  it("should throw an error if ID is not valid", async () => {
    query = new GetChainByIdQuery("invalid-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if chain not found", async () => {
    await chainOrmRepository.clear();

    query = new GetChainByIdQuery(chainOrmEntity.id);

    await expect(sut.execute(query)).rejects.toThrow(
      `Chain with ID ${chainOrmEntity.id} not found.`,
    );
  });

  it("should return the chain if found", async () => {
    query = new GetChainByIdQuery(chainOrmEntity.id);

    const result = await sut.execute(query);

    expect(result).toEqual({
      id: chainOrmEntity.id,
      companyId: chainOrmEntity.companyId,
      name: chainOrmEntity.name,
      description: chainOrmEntity.description,
      currency_code: chainOrmEntity.currency_code,
      country_code: chainOrmEntity.country_code,
      createdAt: chainOrmEntity.createdAt,
      updatedAt: chainOrmEntity.updatedAt,
      disabledAt: chainOrmEntity.disabledAt,
    });
  });
});
