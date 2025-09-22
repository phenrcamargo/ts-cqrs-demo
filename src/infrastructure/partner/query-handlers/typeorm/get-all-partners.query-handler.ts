import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GetAllPartnersQuery,
  GetAllPartnersResponse,
} from "src/application/partner/queries/get-all-partners.query";
import { PartnerOrmEntity } from "../../persistence/typeorm/partner/partner.orm-entity";
import { Repository } from "typeorm";
import { getDocumentTypeNameByCode } from "src/domain/shared/enums/document-type.enum";
import { getCountryNameByCode } from "src/domain/shared/enums/country.enum";

@QueryHandler(GetAllPartnersQuery)
export class GetAllPartnersQueryHandler
  implements IQueryHandler<GetAllPartnersQuery>
{
  constructor(
    @InjectRepository(PartnerOrmEntity, "core")
    private readonly partnerRepository: Repository<PartnerOrmEntity>,
  ) {}

  async execute(): Promise<GetAllPartnersResponse> {
    const ormEntities = await this.partnerRepository.find();

    if (!ormEntities || ormEntities.length === 0) {
      return [];
    }

    return ormEntities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      document: {
        value: entity.document,
        type: getDocumentTypeNameByCode(entity.documentType),
        country: getCountryNameByCode(entity.countryCode),
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      disabledAt: entity.disabledAt,
    }));
  }
}
