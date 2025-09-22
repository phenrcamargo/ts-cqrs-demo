import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import ChainController from "./chain.controller";
import { UUID } from "crypto";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";

describe("ChainController", () => {
  let controller: ChainController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainController],
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

    controller = module.get<ChainController>(ChainController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it("should return all chains", async () => {
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce([{ id: "1" }]);

    const result = await controller.getAllChains();

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should return a chain by id", async () => {
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce({ id: "1" });

    const result = await controller.getChainById("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual({ id: "1" });
  });

  it("should return stores by chain id", async () => {
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce([{ id: "store1" }]);

    const result = await controller.getStoresByChainId("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual([{ id: "store1" }]);
  });

  it("should return full chain by id", async () => {
    jest
      .spyOn(queryBus, "execute")
      .mockResolvedValueOnce({ id: "1", full: true });

    const result = await controller.getFullChainById("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual({ id: "1", full: true });
  });

  it("should create a chain", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce("123");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await controller.createChain({
      companyId: "comp1",
      name: "Chain",
      description: "desc",
      currency_code: 840,
      country_code: 1058,
    });

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(
      new ResourceCreatedDTO("123", { self: "/v1/chains/123" }),
    );
  });

  it("should update a chain", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce({
      name: "Updated Chain",
      description: "Updated desc",
      currencyCode: 840,
      countryCode: 1058,
    });

    const result = await controller.updateChain("1" as UUID, {
      name: "Updated Chain",
      description: "Updated desc",
      currency_code: 840,
      country_code: 1058,
    });

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(
      new ResourceUpdatedDTO(
        "1" as UUID,
        {
          name: "Updated Chain",
          description: "Updated desc",
          currency_code: 840,
          country_code: 1058,
        },
        { self: `/v1/chains/1` },
      ),
    );
  });

  it("should delete a chain", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce(undefined);

    await controller.deleteChain("1" as UUID);

    expect(commandBus.execute).toHaveBeenCalled();
  });
});
