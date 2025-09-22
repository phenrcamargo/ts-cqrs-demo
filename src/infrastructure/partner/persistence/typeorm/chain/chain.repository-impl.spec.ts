import { Repository } from "typeorm";
import { ChainOrmEntity } from "./chain.orm-entity";
import ChainRepositoryImpl from "./chain.repository-impl";
import { mock } from "jest-mock-extended";
import { ID } from "src/domain/partner/value-objects/id.vo";
import Chain from "src/domain/partner/entities/chain";

describe("ChainRepositoryImpl", () => {
  const chainOrmRepositoryMock = mock<Repository<ChainOrmEntity>>();

  let sut: ChainRepositoryImpl;
  let chainOrmEntity: ChainOrmEntity;

  beforeEach(() => {
    chainOrmEntity = new ChainOrmEntity();
    chainOrmEntity.id = ID.create().value;
    chainOrmEntity.companyId = ID.create().value;
    chainOrmEntity.name = "Chain Name";
    chainOrmEntity.description = "Chain description";
    chainOrmEntity.currency_code = 986;
    chainOrmEntity.country_code = 1058;
    chainOrmEntity.createdAt = new Date();

    sut = new ChainRepositoryImpl(chainOrmRepositoryMock);
  });

  describe(ChainRepositoryImpl.prototype.findById.name, () => {
    it("should return a chain by id", async () => {
      chainOrmRepositoryMock.findOne.mockResolvedValue(chainOrmEntity);

      const result = await sut.findById(ID.create(chainOrmEntity.id));

      expect(result?.companyId.value).toEqual(chainOrmEntity.companyId);
      expect(result?.name.value).toEqual(chainOrmEntity.name);
      expect(result?.description.value).toEqual(chainOrmEntity.description);
      expect(result?.currencyCode).toEqual(chainOrmEntity.currency_code);
      expect(result?.countryCode).toEqual(chainOrmEntity.country_code);
      expect(result?.createdAt).toEqual(chainOrmEntity.createdAt.getTime());
    });

    it("should return undefined if chain is not found", async () => {
      chainOrmRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findById(ID.create(chainOrmEntity.id));

      expect(result).toBeUndefined();
    });
  });

  describe(ChainRepositoryImpl.prototype.findByCompanyId.name, () => {
    it("should return a chain by company id", async () => {
      chainOrmRepositoryMock.find.mockResolvedValue([chainOrmEntity]);

      const result = await sut.findByCompanyId(
        ID.create(chainOrmEntity.companyId),
      );

      expect(result[0]?.companyId.value).toEqual(chainOrmEntity.companyId);
      expect(result[0]?.name.value).toEqual(chainOrmEntity.name);
      expect(result[0]?.description.value).toEqual(chainOrmEntity.description);
      expect(result[0]?.currencyCode).toEqual(chainOrmEntity.currency_code);
      expect(result[0]?.countryCode).toEqual(chainOrmEntity.country_code);
      expect(result[0]?.createdAt).toEqual(chainOrmEntity.createdAt.getTime());
    });

    it("should return an empty array if chain is not found", async () => {
      chainOrmRepositoryMock.find.mockResolvedValue([]);

      const result = await sut.findByCompanyId(
        ID.create(chainOrmEntity.companyId),
      );

      expect(result).toEqual([]);
    });
  });

  describe(ChainRepositoryImpl.prototype.saveOrUpdate.name, () => {
    it("should persist and return the chain", async () => {
      chainOrmRepositoryMock.save.mockResolvedValue(chainOrmEntity);

      const chain = new Chain({
        id: chainOrmEntity.id,
        companyId: chainOrmEntity.companyId,
        name: chainOrmEntity.name,
        description: chainOrmEntity.description,
        currencyCode: chainOrmEntity.currency_code,
        countryCode: chainOrmEntity.country_code,
        createdAt: chainOrmEntity.createdAt.getTime(),
      });

      const result = await sut.saveOrUpdate(chain);

      expect(result?.companyId.value).toEqual(chainOrmEntity.companyId);
      expect(result?.name.value).toEqual(chainOrmEntity.name);
      expect(result?.description.value).toEqual(chainOrmEntity.description);
      expect(result?.currencyCode).toEqual(chainOrmEntity.currency_code);
      expect(result?.countryCode).toEqual(chainOrmEntity.country_code);
      expect(result?.createdAt).toEqual(chainOrmEntity.createdAt.getTime());
    });
  });
});
