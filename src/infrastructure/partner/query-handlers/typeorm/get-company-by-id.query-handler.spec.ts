import { mock } from "jest-mock-extended";
import { GetCompanyByIdQuery } from "src/application/partner/queries/get-company-by-id.query";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";
import { CompanyOrmEntity } from "../../persistence/typeorm/company/company.orm-entity";
import { GetCompanyByIdQueryHandler } from "./get-company-by-id.query-handler";

describe("GetCompanyByIdQueryHandler", () => {
  const companyOrmRepository = mock<Repository<CompanyOrmEntity>>();

  let sut: GetCompanyByIdQueryHandler;
  let query: GetCompanyByIdQuery;
  let companyOrmEntity: CompanyOrmEntity;

  beforeEach(() => {
    sut = new GetCompanyByIdQueryHandler(companyOrmRepository);

    companyOrmEntity = new CompanyOrmEntity();
    companyOrmEntity.id = ID.create().value;
    companyOrmEntity.partnerId = ID.create().value;
    companyOrmEntity.name = "Company Test";
    companyOrmEntity.description = "Company description";
    companyOrmEntity.createdAt = new Date();
  });

  it("should throw an error if invalid company ID", async () => {
    query = new GetCompanyByIdQuery("123456789");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if company not found", async () => {
    query = new GetCompanyByIdQuery(companyOrmEntity.id);
    companyOrmRepository.findOne.mockResolvedValue(null);

    await expect(sut.execute(query)).rejects.toThrow(
      `Company with ID ${query.companyId} not found.`,
    );
  });

  it("should return company data if found", async () => {
    query = new GetCompanyByIdQuery(companyOrmEntity.id);
    companyOrmRepository.findOne.mockResolvedValue(companyOrmEntity);

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
