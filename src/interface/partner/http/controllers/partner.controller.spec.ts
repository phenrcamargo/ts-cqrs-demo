import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import PartnerController from "./partner.controller";
import { UUID } from "crypto";
import { CreatePartnerDTO } from "../dto/input/create-partner.dto";
import { UpdatePartnerDTO } from "../dto/input/update-partner.dto";
import { ResourceCreatedDTO } from "../../../shared/http/dto/output/resource-created.dto";
import { ResourceUpdatedDTO } from "../../../shared/http/dto/output/resource-updated.dto";

describe("PartnerController", () => {
  let controller: PartnerController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerController],
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

    controller = module.get<PartnerController>(PartnerController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it("should return all partners", async () => {
    const partners = [{ id: "1", name: "Partner Test" }];
    jest.spyOn(queryBus, "execute").mockResolvedValue(partners);

    const result = await controller.getAllPartners();

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(partners);
  });

  it("should return a partner by id", async () => {
    const partner = { id: "1", name: "Partner Test" };
    jest.spyOn(queryBus, "execute").mockResolvedValue(partner);

    const result = await controller.getPartnerById("1" as unknown as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(partner);
  });

  it("should create a partner", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValue("123");

    const dto = {
      name: "Partner Test",
      description: "desc",
      document: {
        value: "123456789",
        typeCode: "CNPJ",
        countryCode: "BR",
      },
    } as unknown as CreatePartnerDTO;

    const result = await controller.createPartner(dto);

    const selfLink = "/v1/partners/123";

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(new ResourceCreatedDTO("123", { self: selfLink }));
  });

  it("should update a partner", async () => {
    const id = "1" as unknown as UUID;
    const updatedPartner = {
      name: "Updated Partner",
      description: "Updated Desc",
      document: {
        value: "987654321",
        typeCode: "CNPJ",
        countryCode: "BR",
      },
      updatedAt: new Date(),
    };

    jest.spyOn(commandBus, "execute").mockResolvedValue(updatedPartner);

    const dto = {
      name: "Updated Partner",
      description: "Updated Desc",
      document: updatedPartner.document,
    } as unknown as UpdatePartnerDTO;

    const result = await controller.updatePartner(id, dto);

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(
      new ResourceUpdatedDTO(
        id,
        {
          name: updatedPartner.name,
          description: updatedPartner.description,
          document: updatedPartner.document,
          updatedAt: updatedPartner.updatedAt,
        },
        { self: `/v1/partners/${id}` },
      ),
    );
  });

  it("should delete a partner", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValue(undefined);

    await controller.deletePartner("1" as unknown as UUID);

    expect(commandBus.execute).toHaveBeenCalled();
  });
});
