process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { GetCompanyByIdQuery } from "src/application/partner/queries/get-company-by-id.query";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { CompanyOrmEntity } from "src/infrastructure/partner/persistence/typeorm/company/company.orm-entity";
import { GetCompanyByIdQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-company-by-id.query-handler";
import { DataSource, Repository } from "typeorm";

describe("GetCompanyByIdQueryHandler", () => {
  let sut: GetCompanyByIdQueryHandler;
  let query: GetCompanyByIdQuery;

  let dataSource: DataSource;
  let companyOrmEntity: CompanyOrmEntity;
  let companyOrmRepository: Repository<CompanyOrmEntity>;

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
      providers: [GetCompanyByIdQueryHandler],
    }).compile();

    sut = moduleTest.get<GetCompanyByIdQueryHandler>(
      GetCompanyByIdQueryHandler,
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

  it("should throw an error if invalid company ID", async () => {
    query = new GetCompanyByIdQuery("123456789");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if company not found", async () => {
    await companyOrmRepository.clear();

    query = new GetCompanyByIdQuery(companyOrmEntity.id);

    await expect(sut.execute(query)).rejects.toThrow(
      `Company with ID ${query.companyId} not found.`,
    );
  });

  it("should return company data if found", async () => {
    query = new GetCompanyByIdQuery(companyOrmEntity.id);

    const result = await sut.execute(query);

    expect(result).toEqual({
      id: companyOrmEntity.id,
      partnerId: companyOrmEntity.partnerId,
      name: companyOrmEntity.name,
      description: companyOrmEntity.description,
      createdAt: companyOrmEntity.createdAt,
      updatedAt: companyOrmEntity.updatedAt,
      disabledAt: companyOrmEntity.disabledAt,
    });
  });
});
