process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyOrmEntity } from "src/infrastructure/partner/persistence/typeorm/company/company.orm-entity";
import { GetAllCompaniesQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-all-companies.query-handler";
import { DataSource, Repository } from "typeorm";

describe("GetAllCompaniesQueryHandler", () => {
  let sut: GetAllCompaniesQueryHandler;
  let companyOrmRepository: Repository<CompanyOrmEntity>;

  let dataSource: DataSource;
  let companyOrmEntity: CompanyOrmEntity;

  beforeAll(async () => {
    const moduleTest = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: "core",
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [CompanyOrmEntity],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([CompanyOrmEntity], "core"),
      ],
      providers: [GetAllCompaniesQueryHandler],
    }).compile();

    sut = moduleTest.get<GetAllCompaniesQueryHandler>(
      GetAllCompaniesQueryHandler,
    );
    dataSource = moduleTest.get<DataSource>(getDataSourceToken("core"));
    companyOrmRepository = moduleTest.get(
      getRepositoryToken(CompanyOrmEntity, dataSource),
    );
  });

  beforeEach(async () => {
    await companyOrmRepository.clear();

    companyOrmEntity = companyOrmRepository.create({
      id: ID.create().value,
      partnerId: ID.create().value,
      name: "Company Name",
      description: "Company description",
      createdAt: new Date(),
    });
    await companyOrmRepository.save(companyOrmEntity);
  });

  it("should return an empty array if no companies are found", async () => {
    await companyOrmRepository.clear();

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of companies", async () => {
    const result = await sut.execute();
    expect(result).toEqual([
      {
        id: companyOrmEntity.id,
        partnerId: companyOrmEntity.partnerId,
        name: companyOrmEntity.name,
        description: companyOrmEntity.description,
        createdAt: companyOrmEntity.createdAt,
        updatedAt: companyOrmEntity.updatedAt,
        disabledAt: companyOrmEntity.disabledAt,
      },
    ]);
  });
});
