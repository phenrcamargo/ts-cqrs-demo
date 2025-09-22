import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import StoreController from "./store.controller";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { UUID } from "crypto";
import { CreateStoreDTO } from "../dto/input/create-store.dto";
import { UpdateStoreDTO } from "../dto/input/update-store.dto";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";

describe("StoreController", () => {
  let controller: StoreController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it("should return all stores", async () => {
    const stores = [{ id: "1", name: "Store Test" }];
    jest.spyOn(queryBus, "execute").mockResolvedValue(stores);

    const result = await controller.getAllStores();

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(stores);
  });

  it("should return a store by id", async () => {
    const store = { id: "1", name: "Store Test" };
    jest.spyOn(queryBus, "execute").mockResolvedValue(store);

    const result = await controller.getStoreById(ID.create().value as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(store);
  });

  it("should create a store", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValue("123");

    const dto = {
      chainId: "chain1",
      document: "doc",
      documentTypeCode: "CNPJ",
      name: "Store Test",
      description: "desc",
      phone: "123",
      address: { street: "Rua X", city: "SP" },
    } as unknown as CreateStoreDTO;

    const result = await controller.createStore(dto);

    const selfLink = "/v1/stores/123";

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(new ResourceCreatedDTO("123", { self: selfLink }));
  });

  it("should update a store", async () => {
    const id = "1" as unknown as UUID;
    const updateStore = {
      name: "Updated",
      description: "New Desc",
      phone: "456",
      address: {
        number: 75,
        street: "Rua Y",
        city: "RJ",
        state: "RJ",
        country: "Brazil",
        zipCode: "20000-000",
      },
    } as unknown as UpdateStoreDTO;

    const updatedStore = {
      name: "Updated",
      description: "New Desc",
      phone: "456",
      address: {
        number: 75,
        street: "Rua Y",
        city: "RJ",
        state: "RJ",
        country: "Brazil",
        zipCode: "20000-000",
      },
    };

    jest.spyOn(commandBus, "execute").mockResolvedValue(updateStore);

    const result = await controller.updateStore(id, updatedStore);

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(
      new ResourceUpdatedDTO(
        id,
        {
          name: updatedStore.name,
          description: updatedStore.description,
          phone: updatedStore.phone,
          address: {
            number: updatedStore.address.number,
            street: updatedStore.address.street,
            city: updatedStore.address.city,
            state: updatedStore.address.state,
            country: updatedStore.address.country,
            zipCode: updatedStore.address.zipCode,
          },
        },
        { self: `/v1/stores/${id}` },
      ),
    );
  });

  it("should delete a store", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValue(undefined);

    await controller.deleteStore(ID.create().value as UUID);

    expect(commandBus.execute).toHaveBeenCalled();
  });
});
