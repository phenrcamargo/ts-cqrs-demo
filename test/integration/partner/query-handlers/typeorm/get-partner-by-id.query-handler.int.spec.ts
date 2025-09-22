process.env.DB_TYPE = "sqlite";

import { GetPartnerByIdQuery } from "src/application/partner/queries/get-partner-by-id.query";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { DataSource, Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { GetPartnerByIdQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-partner-by-id.query-handler";
import { PartnerOrmEntity } from "src/infrastructure/partner/persistence/typeorm/partner/partner.orm-entity";

describe("GetPartnerByIdQueryHandler", () => {
  let sut: GetPartnerByIdQueryHandler;
  let query: GetPartnerByIdQuery;

  let dataSource: DataSource;
  let partnerOrmEntity: PartnerOrmEntity;
  let partnerOrmRepository: Repository<PartnerOrmEntity>;

  beforeAll(async () => {
    const moduleTest = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: "core",
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [PartnerOrmEntity],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([PartnerOrmEntity], "core"),
      ],
      providers: [GetPartnerByIdQueryHandler],
    }).compile();

    sut = moduleTest.get<GetPartnerByIdQueryHandler>(
      GetPartnerByIdQueryHandler,
    );
    dataSource = moduleTest.get<DataSource>(getDataSourceToken("core"));
    partnerOrmRepository = moduleTest.get(
      getRepositoryToken(PartnerOrmEntity, dataSource),
    );
  });

  beforeEach(async () => {
    await partnerOrmRepository.clear();

    partnerOrmEntity = partnerOrmRepository.create({
      id: ID.create().value,
      document: "02952561000169",
      documentType: 2,
      countryCode: 1058,
      name: "Partner Name",
      description: "Partner description",
      createdAt: new Date(),
    });
    await partnerOrmRepository.save(partnerOrmEntity);
  });

  it("should throw an error if invalid partner ID", async () => {
    query = new GetPartnerByIdQuery("invalid-partner-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if partner not found", async () => {
    await partnerOrmRepository.clear();

    query = new GetPartnerByIdQuery(ID.create().value);

    await expect(sut.execute(query)).rejects.toThrow(
      `Partner with ID ${query.partnerId} not found.`,
    );
  });

  it("should return the partner", async () => {
    query = new GetPartnerByIdQuery(partnerOrmEntity.id);

    const result = await sut.execute(query);

    expect(result).toEqual({
      id: partnerOrmEntity.id,
      name: partnerOrmEntity.name,
      description: partnerOrmEntity.description,
      document: {
        value: partnerOrmEntity.document,
        type: "CNPJ",
        country: "BRAZIL",
      },
      createdAt: partnerOrmEntity.createdAt,
      updatedAt: partnerOrmEntity.updatedAt,
      disabledAt: partnerOrmEntity.disabledAt,
    });
  });
});
