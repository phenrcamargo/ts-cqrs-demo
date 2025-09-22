import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import CompanyController from "./company.controller";
import { mock } from "jest-mock-extended";
import { UUID } from "crypto";
import { ResourceUpdatedDTO } from "src/interface/shared/http/dto/output/resource-updated.dto";
import { ResourceCreatedDTO } from "src/interface/shared/http/dto/output/resource-created.dto";

describe("CompanyController", () => {
  let controller: CompanyController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    commandBus = mock<CommandBus>();
    queryBus = mock<QueryBus>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
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

    controller = module.get<CompanyController>(CompanyController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it("should return all companies", async () => {
    const mockCompanies = [{ id: "1", name: "Test Company" }];
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce(mockCompanies);

    const result = await controller.getAllCompanies();

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(mockCompanies);
  });

  it("should return a company by id", async () => {
    const mockCompany = { id: "1", name: "Test Company" };
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce(mockCompany);

    const result = await controller.getCompanyById("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(mockCompany);
  });

  it("should return chains by company id", async () => {
    const mockChains = [{ id: "c1", name: "Chain 1" }];
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce(mockChains);

    const result = await controller.getChainsByCompanyId("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(mockChains);
  });

  it("should return stores by company id", async () => {
    const mockStores = [{ id: "s1", name: "Store 1" }];
    jest.spyOn(queryBus, "execute").mockResolvedValueOnce(mockStores);

    const result = await controller.getStoresByCompanyId("1" as UUID);

    expect(queryBus.execute).toHaveBeenCalled();
    expect(result).toEqual(mockStores);
  });

  it("should create a company", async () => {
    const id = "1" as unknown as UUID;
    const selfLink = `/v1/companies/${id}`;
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce(id);

    const result = await controller.createCompany({
      partnerId: "p1",
      name: "New Company",
      description: "desc",
    });

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(new ResourceCreatedDTO(id, { self: selfLink }));
  });

  it("should update a company", async () => {
    const id = "1" as unknown as UUID;
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce({
      name: "Updated Company",
      description: "Updated Desc",
    });

    const result = await controller.updateCompany(id, {
      name: "Updated Company",
      description: "Updated Desc",
    });

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(
      new ResourceUpdatedDTO(
        id,
        {
          name: "Updated Company",
          description: "Updated Desc",
        },
        { self: `/v1/companies/${id}` },
      ),
    );
  });

  it("should delete a company", async () => {
    jest.spyOn(commandBus, "execute").mockResolvedValueOnce(undefined);

    await controller.deleteCompany("1" as UUID);

    expect(commandBus.execute).toHaveBeenCalled();
  });
});
