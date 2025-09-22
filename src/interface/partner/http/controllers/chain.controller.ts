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
  GetAllChainsQuery,
  GetAllChainsResponse,
} from "src/application/partner/queries/get-all-chains.query";
import {
  GetChainByIdQuery,
  GetChainByIdResponse,
} from "src/application/partner/queries/get-chain-by-id.query";
import {
  GetFullChainByIdQuery,
  GetFullChainByIdResponse,
} from "src/application/partner/queries/get-full-chain-by-id.query";
import {
  GetStoresByChainIdQuery,
  GetStoresByChainIdResponse,
} from "src/application/partner/queries/get-stores-by-chain-id.query";
import CreateChainCommand from "src/domain/partner/commands/create-chain.command";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";
import { CreateChainDTO } from "../dto/input/create-chain.dto";
import UpdateChainCommand, {
  UpdatedChainDTO,
} from "src/domain/partner/commands/update-chain.command";
import { UpdateChainDTO } from "../dto/input/update-chain.dto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";
import DeleteChainCommand from "src/domain/partner/commands/delete-chain.command";
import { UUID } from "crypto";

@Controller({
  path: "chains",
  version: "1",
})
export default class ChainController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getAllChains() {
    const query = new GetAllChainsQuery();
    return await this.queryBus.execute<GetAllChainsResponse>(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getChainById(@Param("id") id: UUID) {
    const query = new GetChainByIdQuery(id);
    return await this.queryBus.execute<GetChainByIdResponse>(query);
  }

  @Get(":id/stores")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getStoresByChainId(@Param("id") id: UUID) {
    const query = new GetStoresByChainIdQuery(id);
    return await this.queryBus.execute<GetStoresByChainIdResponse>(query);
  }

  @Get(":id/full")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getFullChainById(@Param("id") id: UUID) {
    const query = new GetFullChainByIdQuery(id);
    return await this.queryBus.execute<GetFullChainByIdResponse>(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
  async createChain(@Body() createChainDTO: CreateChainDTO): Promise<any> {
    const { companyId, name, description, currency_code, country_code } =
      createChainDTO;

    const command = new CreateChainCommand(
      companyId,
      name,
      currency_code,
      country_code,
      description,
    );

    const id = await this.commandBus.execute<string>(command);
    const selfLink = `/v1/chains/${id}`;

    return new ResourceCreatedDTO(id, { self: selfLink });
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async updateChain(
    @Param("id") id: UUID,
    @Body() updateChainDTO: UpdateChainDTO,
  ) {
    const { name, description, currency_code, country_code } = updateChainDTO;

    const command = new UpdateChainCommand(
      id,
      name,
      description,
      currency_code,
      country_code,
    );

    const updatedChain =
      await this.commandBus.execute<UpdatedChainDTO>(command);

    return new ResourceUpdatedDTO(
      id,
      {
        name: updatedChain.name,
        description: updatedChain.description,
        currency_code: updatedChain.currencyCode,
        country_code: updatedChain.countryCode,
      },
      { self: `/v1/chains/${id}` },
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header("Content-Type", "application/json")
  async deleteChain(@Param("id") id: UUID) {
    const command = new DeleteChainCommand(id);
    await this.commandBus.execute(command);

    return;
  }
}
