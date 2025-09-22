process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository, DataSource } from "typeorm";
import { CompanyOrmEntity } from "src/infrastructure/partner/persistence/typeorm/company/company.orm-entity";
import CompanyRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/company/company.repository-impl";
import Company from "src/domain/partner/entities/company";

describe("CompanyRepositoryImpl", () => {
  let sut: CompanyRepositoryImpl;
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
      providers: [CompanyRepositoryImpl],
    }).compile();

    sut = moduleTest.get<CompanyRepositoryImpl>(CompanyRepositoryImpl);
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

  describe(CompanyRepositoryImpl.prototype.findById.name, () => {
    it("should return undefined if company not found", async () => {
      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });

    it("should return the company if found", async () => {
      const result = await sut.findById(ID.create(companyOrmEntity.id));

      expect(result?.id.value).toEqual(companyOrmEntity.id);
      expect(result?.name.value).toEqual(companyOrmEntity.name);
      expect(result?.description.value).toEqual(companyOrmEntity.description);
      expect(result?.createdAt).toEqual(companyOrmEntity.createdAt.getTime());
      expect(result?.updatedAt).toEqual(companyOrmEntity.updatedAt?.getTime());
      expect(result?.disabledAt).toEqual(
        companyOrmEntity.disabledAt?.getTime(),
      );
    });
  });

  describe(CompanyRepositoryImpl.prototype.findByPartnerId.name, () => {
    it("should return an empty array if no companies found", async () => {
      const result = await sut.findByPartnerId(ID.create());

      expect(result).toEqual([]);
    });

    it("should return the company if found", async () => {
      const result = await sut.findByPartnerId(
        ID.create(companyOrmEntity.partnerId),
      );

      expect(result[0]?.id.value).toEqual(companyOrmEntity.id);
      expect(result[0]?.name.value).toEqual(companyOrmEntity.name);
      expect(result[0]?.description.value).toEqual(
        companyOrmEntity.description,
      );
      expect(result[0]?.createdAt).toEqual(
        companyOrmEntity.createdAt.getTime(),
      );
      expect(result[0]?.updatedAt).toEqual(
        companyOrmEntity.updatedAt?.getTime(),
      );
      expect(result[0]?.disabledAt).toEqual(
        companyOrmEntity.disabledAt?.getTime(),
      );
    });
  });

  describe(CompanyRepositoryImpl.prototype.saveOrUpdate.name, () => {
    it("should persist and return the company", async () => {
      const newCompany = new Company({
        id: companyOrmEntity.id,
        partnerId: companyOrmEntity.partnerId,
        name: companyOrmEntity.name,
        description: companyOrmEntity.description,
        createdAt: companyOrmEntity.createdAt.getTime(),
        updatedAt: companyOrmEntity.updatedAt?.getTime(),
        disabledAt: companyOrmEntity.disabledAt?.getTime(),
      });

      const result = await sut.saveOrUpdate(newCompany);

      expect(result.id.value).toEqual(companyOrmEntity.id);
      expect(result.name.value).toEqual(companyOrmEntity.name);
      expect(result.description.value).toEqual(companyOrmEntity.description);
      expect(result.createdAt).toEqual(companyOrmEntity.createdAt.getTime());
      expect(result.updatedAt).toEqual(companyOrmEntity.updatedAt?.getTime());
      expect(result.disabledAt).toEqual(companyOrmEntity.disabledAt?.getTime());
    });

    it("should update the company", async () => {
      const company = await sut.findById(ID.create(companyOrmEntity.id));
      expect(company).toBeDefined();
      expect(company!.updatedAt).toBeUndefined();

      company!.updateDetails({
        name: "Updated Name",
        description: "Updated Description",
      });

      const updatedResult = await sut.saveOrUpdate(company!);

      expect(updatedResult.name.value).toEqual("Updated Name");
      expect(updatedResult.description.value).toEqual("Updated Description");
      expect(updatedResult.updatedAt).toBeDefined();
    });
  });
});
