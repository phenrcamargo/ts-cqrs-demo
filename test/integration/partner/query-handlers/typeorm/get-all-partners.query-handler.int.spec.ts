process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { PartnerOrmEntity } from "src/infrastructure/partner/persistence/typeorm/partner/partner.orm-entity";
import { GetAllPartnersQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-all-partners.query-handler";
import { DataSource, Repository } from "typeorm";

describe("GetAllPartnersQueryHandler", () => {
  let sut: GetAllPartnersQueryHandler;
  let partnerOrmRepository: Repository<PartnerOrmEntity>;

  let dataSource: DataSource;
  let partnerOrmEntity: PartnerOrmEntity;

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
      providers: [GetAllPartnersQueryHandler],
    }).compile();

    sut = moduleTest.get<GetAllPartnersQueryHandler>(
      GetAllPartnersQueryHandler,
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

  it("should return an empty array if no partners are found", async () => {
    await partnerOrmRepository.clear();

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of partners", async () => {
    const result = await sut.execute();
    expect(result).toEqual([
      {
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
      },
    ]);
  });
});
