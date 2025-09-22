import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import CompanyRepositoryImpl from "./company.repository-impl";
import { CompanyOrmEntity } from "./company.orm-entity";
import { ID } from "src/domain/partner/value-objects/id.vo";
import Company from "src/domain/partner/entities/company";

describe("CompanyRepositoryImpl", () => {
  const companyOrmRepositoryMock = mock<Repository<CompanyOrmEntity>>();

  let sut: CompanyRepositoryImpl;
  let companyOrmEntity: CompanyOrmEntity;

  beforeEach(() => {
    companyOrmEntity = new CompanyOrmEntity();
    companyOrmEntity.id = ID.create().value;
    companyOrmEntity.partnerId = ID.create().value;
    companyOrmEntity.name = "Company Test";
    companyOrmEntity.description = "Company description";
    companyOrmEntity.createdAt = new Date();

    sut = new CompanyRepositoryImpl(companyOrmRepositoryMock);
  });

  describe(CompanyRepositoryImpl.prototype.findById.name, () => {
    it("should return undefined if company not found", async () => {
      companyOrmRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });

    it("should return the company if found", async () => {
      companyOrmRepositoryMock.findOne.mockResolvedValue(companyOrmEntity);

      const result = await sut.findById(ID.create());

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
      companyOrmRepositoryMock.find.mockResolvedValue([]);

      const result = await sut.findByPartnerId(ID.create());

      expect(result).toEqual([]);
    });

    it("should return the company if found", async () => {
      companyOrmRepositoryMock.find.mockResolvedValue([companyOrmEntity]);

      const result = await sut.findByPartnerId(ID.create());

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
      companyOrmRepositoryMock.save.mockResolvedValue(companyOrmEntity);

      const company = new Company({
        id: companyOrmEntity.id,
        partnerId: companyOrmEntity.partnerId,
        name: companyOrmEntity.name,
        description: companyOrmEntity.description,
        createdAt: companyOrmEntity.createdAt.getTime(),
      });

      const result = await sut.saveOrUpdate(company);

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
});
