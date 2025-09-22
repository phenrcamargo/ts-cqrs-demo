import { mock } from "jest-mock-extended";
import { GetPartnerByIdQuery } from "src/application/partner/queries/get-partner-by-id.query";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Repository } from "typeorm";
import { PartnerOrmEntity } from "../../persistence/typeorm/partner/partner.orm-entity";
import { GetPartnerByIdQueryHandler } from "./get-partner-by-id.query-handler";

describe("GetPartnerByIdQueryHandler", () => {
  const partnerOrmRepository = mock<Repository<PartnerOrmEntity>>();

  let sut: GetPartnerByIdQueryHandler;
  let query: GetPartnerByIdQuery;
  let partnerOrmEntity: PartnerOrmEntity;

  beforeEach(() => {
    sut = new GetPartnerByIdQueryHandler(partnerOrmRepository);

    partnerOrmEntity = new PartnerOrmEntity();
    partnerOrmEntity.id = ID.create().value;
    partnerOrmEntity.document = "02952561000169";
    partnerOrmEntity.documentType = 2;
    partnerOrmEntity.countryCode = 1058;
    partnerOrmEntity.name = "Partner Test";
    partnerOrmEntity.description = "Partner description";
    partnerOrmEntity.createdAt = new Date();
  });

  it("should throw an error if invalid partner ID", async () => {
    query = new GetPartnerByIdQuery("invalid-partner-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if partner not found", async () => {
    partnerOrmRepository.findOne.mockResolvedValue(null);
    query = new GetPartnerByIdQuery(ID.create().value);

    await expect(sut.execute(query)).rejects.toThrow(
      `Partner with ID ${query.partnerId} not found.`,
    );
  });

  it("should return the partner", async () => {
    partnerOrmRepository.findOne.mockResolvedValue(partnerOrmEntity);
    query = new GetPartnerByIdQuery(ID.create().value);

    const result = await sut.execute(query);

    expect(result).toEqual({
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
    });
  });
});
