import { GetAllCompaniesQueryHandler } from "./get-all-companies.query-handler";
import { CompanyOrmEntity } from "../../persistence/typeorm/company/company.orm-entity";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";

describe("GetAllCompaniesQueryHandler", () => {
  const companyOrmRepositoryMock = mock<Repository<CompanyOrmEntity>>();

  let sut: GetAllCompaniesQueryHandler;
  let companyOrmEntity: CompanyOrmEntity;

  beforeEach(() => {
    sut = new GetAllCompaniesQueryHandler(companyOrmRepositoryMock);

    companyOrmEntity = new CompanyOrmEntity();
    companyOrmEntity.id = ID.create().value;
    companyOrmEntity.partnerId = ID.create().value;
    companyOrmEntity.name = "Company Test";
    companyOrmEntity.description = "Company description";
    companyOrmEntity.createdAt = new Date();
  });

  it("should return an empty array if no companies are found", async () => {
    companyOrmRepositoryMock.find.mockResolvedValue([]);

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of companies", async () => {
    companyOrmRepositoryMock.find.mockResolvedValue([companyOrmEntity]);

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
