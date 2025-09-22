import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { PartnerOrmEntity } from "./partner.orm-entity";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Document } from "src/domain/partner/value-objects/document.vo";
import PartnerRepositoryImpl from "./partner.repository-impl";
import Partner from "src/domain/partner/entities/partner";

describe("PartnerRepositoryImpl", () => {
  const partnerRepositoryMock = mock<Repository<PartnerOrmEntity>>();

  let sut: PartnerRepositoryImpl;
  let partnerOrmEntity: PartnerOrmEntity;

  beforeEach(() => {
    partnerOrmEntity = new PartnerOrmEntity();
    partnerOrmEntity.id = ID.create().value;
    partnerOrmEntity.document = "02952561000169";
    partnerOrmEntity.documentType = 2;
    partnerOrmEntity.countryCode = 1058;
    partnerOrmEntity.name = "Partner Test";
    partnerOrmEntity.description = "Partner description";
    partnerOrmEntity.createdAt = new Date();

    sut = new PartnerRepositoryImpl(partnerRepositoryMock);
  });

  describe(PartnerRepositoryImpl.prototype.findById.name, () => {
    it("should return undefined if partner not found", async () => {
      partnerRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });

    it("should return the partner if found", async () => {
      partnerRepositoryMock.findOne.mockResolvedValue(partnerOrmEntity);

      const result = await sut.findById(ID.create());

      expect(result?.id.value).toEqual(partnerOrmEntity.id);
      expect(result?.name.value).toEqual(partnerOrmEntity.name);
      expect(result?.document.value).toEqual(partnerOrmEntity.document);
      expect(result?.createdAt).toEqual(partnerOrmEntity.createdAt.getTime());
      expect(result?.updatedAt).toEqual(partnerOrmEntity.updatedAt?.getTime());
      expect(result?.disabledAt).toEqual(
        partnerOrmEntity.disabledAt?.getTime(),
      );
    });
  });

  describe(PartnerRepositoryImpl.prototype.findByDocument.name, () => {
    it("should return undefined if partner not found", async () => {
      partnerRepositoryMock.findOne.mockResolvedValue(null);

      const result = await sut.findByDocument(
        Document.create({
          value: "02952561000169",
          countryCode: 1058,
          typeCode: 2,
        }),
      );

      expect(result).toBeUndefined();
    });

    it("should return the partner if found", async () => {
      partnerRepositoryMock.findOne.mockResolvedValue(partnerOrmEntity);

      const result = await sut.findByDocument(
        Document.create({
          value: "02952561000169",
          countryCode: 1058,
          typeCode: 2,
        }),
      );

      expect(result?.id.value).toEqual(partnerOrmEntity.id);
      expect(result?.name.value).toEqual(partnerOrmEntity.name);
      expect(result?.document.value).toEqual(partnerOrmEntity.document);
      expect(result?.createdAt).toEqual(partnerOrmEntity.createdAt.getTime());
      expect(result?.updatedAt).toEqual(partnerOrmEntity.updatedAt?.getTime());
      expect(result?.disabledAt).toEqual(
        partnerOrmEntity.disabledAt?.getTime(),
      );
    });
  });

  describe(PartnerRepositoryImpl.prototype.saveOrUpdate.name, () => {
    it("should persist and return the partner", async () => {
      partnerRepositoryMock.save.mockResolvedValue(partnerOrmEntity);

      const partner = new Partner({
        id: partnerOrmEntity.id,
        document: partnerOrmEntity.document,
        documentTypeCode: partnerOrmEntity.documentType,
        countryCode: partnerOrmEntity.countryCode,
        name: partnerOrmEntity.name,
        description: partnerOrmEntity.description,
        createdAt: partnerOrmEntity.createdAt.getTime(),
        updatedAt: partnerOrmEntity.updatedAt?.getTime(),
        disabledAt: undefined,
      });

      const result = await sut.saveOrUpdate(partner);

      expect(result.id.value).toEqual(partnerOrmEntity.id);
      expect(result.name.value).toEqual(partnerOrmEntity.name);
      expect(result.document.value).toEqual(partnerOrmEntity.document);
      expect(result.createdAt).toEqual(partnerOrmEntity.createdAt.getTime());
      expect(result.updatedAt).toEqual(partnerOrmEntity.updatedAt?.getTime());
      expect(result.disabledAt).toEqual(partnerOrmEntity.disabledAt?.getTime());
    });
  });
});
