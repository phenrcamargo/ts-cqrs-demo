import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import CreatePartnerCommand from "src/domain/partner/commands/create-partner.command";
import { ResourceCreatedDTO } from "../../../shared/http/dto/output/resource-created.dto";
import { CreatePartnerDTO } from "../dto/input/create-partner.dto";
import { UpdatePartnerDTO } from "../dto/input/update-partner.dto";
import UpdatePartnerCommand, {
  UpdatedPartnerDTO,
} from "src/domain/partner/commands/update-partner.command";
import { ResourceUpdatedDTO } from "../../../shared/http/dto/output/resource-updated.dto";
import DeletePartnerCommand from "src/domain/partner/commands/delete-partner.command";
import {
  GetAllPartnersQuery,
  GetAllPartnersResponse,
} from "src/application/partner/queries/get-all-partners.query";
import {
  GetPartnerByIdQuery,
  GetPartnerByIdResponse,
} from "src/application/partner/queries/get-partner-by-id.query";
import { UUID } from "crypto";

@Controller({
  path: "partners",
  version: "1",
})
export default class PartnerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getAllPartners() {
    const query = new GetAllPartnersQuery();
    return await this.queryBus.execute<GetAllPartnersResponse>(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getPartnerById(@Param("id") id: UUID) {
    const query = new GetPartnerByIdQuery(id);
    return await this.queryBus.execute<GetPartnerByIdResponse>(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
  async createPartner(@Body() createPartnerDto: CreatePartnerDTO) {
    const { name, description, document } = createPartnerDto;

    const command = new CreatePartnerCommand(
      document.value,
      document.typeCode,
      document.countryCode,
      name,
      description,
    );

    const id = await this.commandBus.execute<string>(command);
    const selfLink = `/v1/partners/${id}`;

    return new ResourceCreatedDTO(id, { self: selfLink });
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async updatePartner(
    @Param("id") id: UUID,
    @Body() updatePartnerDto: UpdatePartnerDTO,
  ) {
    const { name, description, document } = updatePartnerDto;

    const command = new UpdatePartnerCommand(id, name, description, document);

    const updatedPartner =
      await this.commandBus.execute<UpdatedPartnerDTO>(command);

    return new ResourceUpdatedDTO(
      id,
      {
        name: updatedPartner.name,
        description: updatedPartner.description,
        document: updatedPartner.document,
        updatedAt: updatedPartner.updatedAt,
      },
      { self: `/v1/partners/${id}` },
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header("Content-Type", "application/json")
  async deletePartner(@Param("id") id: UUID) {
    const command = new DeletePartnerCommand(id);
    await this.commandBus.execute(command);

    return;
  }
}
