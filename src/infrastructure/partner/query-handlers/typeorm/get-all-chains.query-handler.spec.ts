import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { GetAllChainsQueryHandler } from "./get-all-chains.query-handler";
import { ID } from "src/domain/partner/value-objects/id.vo";

describe("GetAllChainsQueryHandler", () => {
  const chainOrmRepositoryMock = mock<Repository<ChainOrmEntity>>();

  let sut: GetAllChainsQueryHandler;
  let chainOrmEntity: ChainOrmEntity;

  beforeEach(() => {
    sut = new GetAllChainsQueryHandler(chainOrmRepositoryMock);

    chainOrmEntity = new ChainOrmEntity();
    chainOrmEntity.id = ID.create().value;
    chainOrmEntity.companyId = ID.create().value;
    chainOrmEntity.name = "Chain Name";
    chainOrmEntity.description = "Chain description";
    chainOrmEntity.currency_code = 986;
    chainOrmEntity.country_code = 1058;
    chainOrmEntity.createdAt = new Date();
  });

  it("should return an empty array if no chains are found", async () => {
    chainOrmRepositoryMock.find.mockResolvedValue([]);

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of chains", async () => {
    chainOrmRepositoryMock.find.mockResolvedValue([chainOrmEntity]);

    const result = await sut.execute();
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
