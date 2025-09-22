process.env.DB_TYPE = "sqlite";

import { ID } from "src/domain/partner/value-objects/id.vo";
import { DataSource, Repository } from "typeorm";
import { GetChainsByCompanyIdQuery } from "src/application/partner/queries/get-chains-by-company-id.query";
import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import { GetChainsByCompanyIdQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-chains-by-company-id.query-handler";

describe("GetChainsByCompanyIdQueryHandler", () => {
  let sut: GetChainsByCompanyIdQueryHandler;
  let query: GetChainsByCompanyIdQuery;

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
      providers: [GetChainsByCompanyIdQueryHandler],
    }).compile();

    sut = moduleTest.get<GetChainsByCompanyIdQueryHandler>(
      GetChainsByCompanyIdQueryHandler,
    );
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

  it("should throw an error for invalid company ID", async () => {
    query = new GetChainsByCompanyIdQuery("123456789");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if no chains found", async () => {
    await chainOrmRepository.clear();

    query = new GetChainsByCompanyIdQuery(ID.create().value);

    await expect(sut.execute(query)).rejects.toThrow(
      `No chains found for company with ID: ${query.companyId}`,
    );
  });

  it("should return chains for valid company ID", async () => {
    query = new GetChainsByCompanyIdQuery(chainOrmEntity.companyId);

    const result = await sut.execute(query);

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
