import { InjectRepository } from "@nestjs/typeorm";
import {
  GetPartnerByIdQuery,
  GetPartnerByIdResponse,
} from "src/application/partner/queries/get-partner-by-id.query";
import { PartnerOrmEntity } from "../../persistence/typeorm/partner/partner.orm-entity";
import { Repository } from "typeorm";
import { PartnerNotFoundError } from "src/application/partner/errors/partner-not-found.error";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";
import { ID } from "src/domain/partner/value-objects/id.vo";

@QueryHandler(GetPartnerByIdQuery)
export class GetPartnerByIdQueryHandler
  implements IQueryHandler<GetPartnerByIdQuery>
{
  constructor(
    @InjectRepository(PartnerOrmEntity, "core")
    private readonly partnerRepository: Repository<PartnerOrmEntity>,
  ) {}

  async execute(query: GetPartnerByIdQuery): Promise<GetPartnerByIdResponse> {
    const { partnerId } = query;

    ID.validate(partnerId);

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new PartnerNotFoundError(partnerId);
    }

    return {
      id: partner.id,
      name: partner.name,
      description: partner.description,
      document: {
        value: partner.document,
        type: getDocumentTypeNameByCode(partner.documentType),
        country: getCountryNameByCode(partner.countryCode),
      },
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
      disabledAt: partner.disabledAt,
    };
  }
}
