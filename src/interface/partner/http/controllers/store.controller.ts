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
  GetAllStoresQuery,
  GetAllStoresResponse,
} from "src/application/partner/queries/get-all-stores.query";
import {
  GetStoreByIdQuery,
  GetStoreByIdResponse,
} from "src/application/partner/queries/get-store-by-id.query";
import CreateStoreCommand from "src/domain/partner/commands/create-store.command";
import { CreateStoreDTO } from "../dto/input/create-store.dto";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";
import UpdateStoreCommand, {
  UpdatedStoreDTO,
} from "src/domain/partner/commands/update-store.command";
import { UpdateStoreDTO } from "../dto/input/update-store.dto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";
import DeleteStoreCommand from "src/domain/partner/commands/delete-store.command";
import { UUID } from "crypto";

@Controller({
  path: "stores",
  version: "1",
})
export default class StoreController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getAllStores() {
    const query = new GetAllStoresQuery();
    return await this.queryBus.execute<GetAllStoresResponse>(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async getStoreById(@Param("id") id: UUID) {
    const query = new GetStoreByIdQuery(id);
    return await this.queryBus.execute<GetStoreByIdResponse>(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
  async createStore(@Body() createStoreDto: CreateStoreDTO) {
    const {
      chainId,
      document,
      documentTypeCode,
      name,
      description,
      phone,
      address,
    } = createStoreDto;

    const command = new CreateStoreCommand(
      chainId,
      document,
      documentTypeCode,
      name,
      phone,
      address,
      description,
    );

    const id = await this.commandBus.execute<string>(command);
    const selfLink = `/v1/stores/${id}`;

    return new ResourceCreatedDTO(id, { self: selfLink });
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "application/json")
  async updateStore(
    @Param("id") id: UUID,
    @Body() updateStoreDto: UpdateStoreDTO,
  ) {
    const { name, description, phone, address } = updateStoreDto;

    const command = new UpdateStoreCommand(
      id,
      name,
      description,
      phone,
      address,
    );

    const updatedStore =
      await this.commandBus.execute<UpdatedStoreDTO>(command);

    return new ResourceUpdatedDTO(
      id,
      {
        name: updatedStore.name,
        description: updatedStore.description,
        phone: updatedStore.phone,
        address: {
          number: updatedStore.address?.number,
          street: updatedStore.address?.street,
          city: updatedStore.address?.city,
          state: updatedStore.address?.state,
          country: updatedStore.address?.country,
          zipCode: updatedStore.address?.zipCode,
          latitude: updatedStore.address?.latitude,
          longitude: updatedStore.address?.longitude,
        },
      },
      { self: `/v1/stores/${id}` },
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStore(@Param("id") id: UUID) {
    const command = new DeleteStoreCommand(id);
    await this.commandBus.execute(command);
    return;
  }
}
