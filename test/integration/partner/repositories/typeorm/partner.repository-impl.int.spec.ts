process.env.DB_TYPE = "sqlite";

import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import Partner from "src/domain/partner/entities/partner";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Document } from "src/domain/partner/value-objects/document.vo";
import { PartnerOrmEntity } from "src/infrastructure/partner/persistence/typeorm/partner/partner.orm-entity";
import PartnerRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/partner/partner.repository-impl";
import { Repository, DataSource } from "typeorm";

describe("PartnerRepositoryImpl", () => {
  let sut: PartnerRepositoryImpl;
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
      providers: [PartnerRepositoryImpl],
    }).compile();

    sut = moduleTest.get<PartnerRepositoryImpl>(PartnerRepositoryImpl);
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

  describe(PartnerRepositoryImpl.prototype.findById.name, () => {
    it("should return undefined if partner not found", async () => {
      const result = await sut.findById(ID.create());

      expect(result).toBeUndefined();
    });

    it("should return the partner if found", async () => {
      const result = await sut.findById(ID.create(partnerOrmEntity.id));

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
      const result = await sut.findByDocument(
        Document.create({
          value: "02952561000168",
          countryCode: 1058,
          typeCode: 2,
        }),
      );

      expect(result).toBeUndefined();
    });

    it("should return the partner if found", async () => {
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
      const newPartner = new Partner({
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

      const result = await sut.saveOrUpdate(newPartner);

      expect(result.id.value).toEqual(partnerOrmEntity.id);
      expect(result.name.value).toEqual(partnerOrmEntity.name);
      expect(result.document.value).toEqual(partnerOrmEntity.document);
      expect(result.createdAt).toEqual(partnerOrmEntity.createdAt.getTime());
      expect(result.updatedAt).toEqual(partnerOrmEntity.updatedAt?.getTime());
      expect(result.disabledAt).toEqual(partnerOrmEntity.disabledAt?.getTime());
    });

    it("should update the partner", async () => {
      const partner = await sut.findById(ID.create(partnerOrmEntity.id));
      expect(partner).toBeDefined();
      expect(partner!.updatedAt).toBeUndefined();

      partner!.updateDetails({
        name: "Updated Name",
        description: "Updated Description",
      });

      const updatedResult = await sut.saveOrUpdate(partner!);

      expect(updatedResult.name.value).toEqual("Updated Name");
      expect(updatedResult.description.value).toEqual("Updated Description");
      expect(updatedResult.updatedAt).toBeDefined();
    });
  });
});
