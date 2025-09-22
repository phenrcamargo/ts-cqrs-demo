import { GetAllPartnersQueryHandler } from "./get-all-partners.query-handler";
import { PartnerOrmEntity } from "../../persistence/typeorm/partner/partner.orm-entity";
import { mock } from "jest-mock-extended";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";

describe("GetAllPartnersQueryHandler", () => {
  const partnerOrmRepositoryMock = mock<Repository<PartnerOrmEntity>>();

  let sut: GetAllPartnersQueryHandler;
  let partnerOrmEntity: PartnerOrmEntity;

  beforeEach(() => {
    sut = new GetAllPartnersQueryHandler(partnerOrmRepositoryMock);

    partnerOrmEntity = new PartnerOrmEntity();
    partnerOrmEntity.id = ID.create().value;
    partnerOrmEntity.document = "02952561000169";
    partnerOrmEntity.documentType = 2;
    partnerOrmEntity.countryCode = 1058;
    partnerOrmEntity.name = "Partner Test";
    partnerOrmEntity.description = "Partner description";
    partnerOrmEntity.createdAt = new Date();
  });

  it("should return an empty array if no partners are found", async () => {
    partnerOrmRepositoryMock.find.mockResolvedValue([]);

    const result = await sut.execute();
    expect(result).toEqual([]);
  });

  it("should return an array of partners", async () => {
    partnerOrmRepositoryMock.find.mockResolvedValue([partnerOrmEntity]);

    const result = await sut.execute();
    expect(result).toEqual([
      {
        id: partnerOrmEntity.id,
        name: partnerOrmEntity.name,
        description: partnerOrmEntity.description,
        document: {
          value: partnerOrmEntity.document,
          type: "CNPJ",
          country: "BRAZIL",
        },
        createdAt: partnerOrmEntity.createdAt,
        updatedAt: partnerOrmEntity.updatedAt,
        disabledAt: partnerOrmEntity.disabledAt,
      },
    ]);
  });
});
