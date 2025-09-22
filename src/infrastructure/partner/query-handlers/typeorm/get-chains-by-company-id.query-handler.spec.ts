import { mock } from "jest-mock-extended";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { GetChainsByCompanyIdQueryHandler } from "./get-chains-by-company-id.query-handler";
import { GetChainsByCompanyIdQuery } from "src/application/partner/queries/get-chains-by-company-id.query";

describe("GetChainsByCompanyIdQueryHandler", () => {
  const chainOrmRepositoryMock = mock<Repository<ChainOrmEntity>>();

  let sut: GetChainsByCompanyIdQueryHandler;
  let query: GetChainsByCompanyIdQuery;
  let chainOrmEntity: ChainOrmEntity;

  beforeEach(() => {
    sut = new GetChainsByCompanyIdQueryHandler(chainOrmRepositoryMock);

    chainOrmEntity = new ChainOrmEntity();
    chainOrmEntity.id = ID.create().value;
    chainOrmEntity.companyId = ID.create().value;
    chainOrmEntity.name = "Chain Name";
    chainOrmEntity.description = "Chain description";
    chainOrmEntity.currency_code = 986;
    chainOrmEntity.country_code = 1058;
    chainOrmEntity.createdAt = new Date();
  });

  it("should throw an error for invalid company ID", async () => {
    query = new GetChainsByCompanyIdQuery("123456789");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if no chains found", async () => {
    query = new GetChainsByCompanyIdQuery(ID.create().value);
    chainOrmRepositoryMock.find.mockResolvedValue([]);

    await expect(sut.execute(query)).rejects.toThrow(
      `No chains found for company with ID: ${query.companyId}`,
    );
  });

  it("should return chains for valid company ID", async () => {
    query = new GetChainsByCompanyIdQuery(ID.create().value);
    chainOrmRepositoryMock.find.mockResolvedValue([chainOrmEntity]);

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
