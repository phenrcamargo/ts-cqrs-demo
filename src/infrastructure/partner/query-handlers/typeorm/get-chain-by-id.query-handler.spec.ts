import { GetChainByIdQuery } from "src/application/partner/queries/get-chain-by-id.query";
import { GetChainByIdQueryHandler } from "./get-chain-by-id.query-handler";
import { ChainOrmEntity } from "../../persistence/typeorm/chain/chain.orm-entity";
import { mock } from "jest-mock-extended";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";

describe("GetChainByIdQueryHandler", () => {
  const chainOrmRepositoryMock = mock<Repository<ChainOrmEntity>>();

  let sut: GetChainByIdQueryHandler;
  let query: GetChainByIdQuery;
  let chainOrmEntity: ChainOrmEntity;

  beforeEach(() => {
    sut = new GetChainByIdQueryHandler(chainOrmRepositoryMock);

    chainOrmEntity = new ChainOrmEntity();
    chainOrmEntity.id = ID.create().value;
    chainOrmEntity.companyId = ID.create().value;
    chainOrmEntity.name = "Chain Name";
    chainOrmEntity.description = "Chain description";
    chainOrmEntity.currency_code = 986;
    chainOrmEntity.country_code = 1058;
    chainOrmEntity.createdAt = new Date();
  });

  it("should throw an error if ID is not valid", async () => {
    query = new GetChainByIdQuery("invalid-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if chain not found", async () => {
    query = new GetChainByIdQuery(chainOrmEntity.id);

    chainOrmRepositoryMock.findOne.mockResolvedValue(null);

    await expect(sut.execute(query)).rejects.toThrow(
      `Chain with ID ${chainOrmEntity.id} not found.`,
    );
  });

  it("should return the chain if found", async () => {
    query = new GetChainByIdQuery(chainOrmEntity.id);

    chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);

    const result = await sut.execute(query);

    expect(result).toEqual({
      id: chainOrmEntity.id,
      companyId: chainOrmEntity.companyId,
      name: chainOrmEntity.name,
      description: chainOrmEntity.description,
      currency_code: chainOrmEntity.currency_code,
      country_code: chainOrmEntity.country_code,
      createdAt: chainOrmEntity.createdAt,
      updatedAt: chainOrmEntity.updatedAt,
      disabledAt: chainOrmEntity.disabledAt,
    });
  });
});
