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
import {
  GetAllCompaniesQuery,
  GetAllCompaniesResponse,
} from "src/application/partner/queries/get-all-companies.query";
import {
  GetChainsByCompanyIdQuery,
  GetChainsByCompanyIdResponse,
} from "src/application/partner/queries/get-chains-by-company-id.query";
import {
  GetCompanyByIdQuery,
  GetCompanyByIdResponse,
} from "src/application/partner/queries/get-company-by-id.query";
import {
  GetStoresByCompanyIdQuery,
  GetStoresByCompanyIdResponse,
} from "src/application/partner/queries/get-stores-by-company-id.query";
import CreateCompanyCommand from "src/domain/partner/commands/create-company.command";
import { CreateCompanyDTO } from "../dto/input/create-company.dto";
import UpdateCompanyCommand, {
  UpdatedCompanyDTO,
} from "src/domain/partner/commands/update-company.command";
import { UpdateCompanyDTO } from "../dto/input/update-company.dto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";
import DeleteCompanyCommand from "src/domain/partner/commands/delete-company.command";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";
import { UUID } from "crypto";

@Controller({
  path: "companies",
  version: "1",
})
export default class CompanyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getAllCompanies() {
    const query = new GetAllCompaniesQuery();
    return await this.queryBus.execute<GetAllCompaniesResponse>(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getCompanyById(@Param("id") id: UUID) {
    const query = new GetCompanyByIdQuery(id);
    return await this.queryBus.execute<GetCompanyByIdResponse>(query);
  }

  @Get(":id/chains")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getChainsByCompanyId(@Param("id") id: UUID) {
    const query = new GetChainsByCompanyIdQuery(id);
    return await this.queryBus.execute<GetChainsByCompanyIdResponse>(query);
  }

  @Get(":id/stores")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getStoresByCompanyId(@Param("id") id: UUID) {
    const query = new GetStoresByCompanyIdQuery(id);
    return await this.queryBus.execute<GetStoresByCompanyIdResponse>(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
  async createCompany(@Body() createCompanyDTO: CreateCompanyDTO) {
    const { partnerId, name, description } = createCompanyDTO;
    const command = new CreateCompanyCommand(partnerId, name, description);

    const id = await this.commandBus.execute<string>(command);
    const selfLink = `/v1/companies/${id}`;

    return new ResourceCreatedDTO(id, { self: selfLink });
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async updateCompany(
    @Param("id") id: UUID,
    @Body() updateCompanyDTO: UpdateCompanyDTO,
  ) {
    const { name, description } = updateCompanyDTO;
    const command = new UpdateCompanyCommand(id, name, description);
    const updatedCompany =
      await this.commandBus.execute<UpdatedCompanyDTO>(command);

    return new ResourceUpdatedDTO(
      id,
      {
        name: updatedCompany.name,
        description: updatedCompany.description,
      },
      { self: `/v1/companies/${id}` },
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header("Content-Type", "application/json")
  async deleteCompany(@Param("id") id: UUID) {
    const command = new DeleteCompanyCommand(id);
    await this.commandBus.execute(command);

    return;
  }
}
