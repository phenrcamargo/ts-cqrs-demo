process.env.DB_TYPE = "sqlite";

import { DataSource, Repository } from "typeorm";
import { ID } from "src/domain/partner/value-objects/id.vo";
import { Test } from "@nestjs/testing";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { GetStoresByCompanyIdQuery } from "src/application/partner/queries/get-stores-by-company-id.query";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import { AddressOrmVO } from "src/infrastructure/partner/persistence/typeorm/store/address-orm-vo";
import { StoreOrmEntity } from "src/infrastructure/partner/persistence/typeorm/store/store.orm-entity";
import { GetStoresByCompanyIdQueryHandler } from "src/infrastructure/partner/query-handlers/typeorm/get-stores-by-company-id.query-handler";

describe("GetStoresByCompanyIdQueryHandler", () => {
  let sut: GetStoresByCompanyIdQueryHandler;
  let query: GetStoresByCompanyIdQuery;

  let dataSource: DataSource;
  let chainOrmEntity: ChainOrmEntity;
  let storeOrmEntity: StoreOrmEntity;
  let storeOrmRepository: Repository<StoreOrmEntity>;
  let chainOrmRepository: Repository<ChainOrmEntity>;

  beforeAll(async () => {
    const moduleTest = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: "core",
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [StoreOrmEntity, ChainOrmEntity],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([StoreOrmEntity, ChainOrmEntity], "core"),
      ],
      providers: [GetStoresByCompanyIdQueryHandler],
    }).compile();

    sut = moduleTest.get<GetStoresByCompanyIdQueryHandler>(
      GetStoresByCompanyIdQueryHandler,
    );
    dataSource = moduleTest.get<DataSource>(getDataSourceToken("core"));
    storeOrmRepository = moduleTest.get(
      getRepositoryToken(StoreOrmEntity, dataSource),
    );
    chainOrmRepository = moduleTest.get(
      getRepositoryToken(ChainOrmEntity, dataSource),
    );
  });

  beforeEach(async () => {
    await storeOrmRepository.clear();
    await chainOrmRepository.clear();

    chainOrmEntity = chainOrmRepository.create({
      id: ID.create().value,
      companyId: ID.create().value,
      name: "Chain Name",
      description: "Chain description",
      currency_code: 986,
      country_code: 1058,
      createdAt: new Date(),
    });
    await chainOrmRepository.save(chainOrmEntity);

    storeOrmEntity = storeOrmRepository.create({
      id: ID.create().value,
      chainId: chainOrmEntity.id,
      document: "02952561000169",
      documentType: 2,
      name: "Store Name",
      description: "Store description",
      phone: "5519999995623",
      address: {
        number: 792,
        street: "Store Street",
        city: "Store City",
        state: "Store State",
        country: "Store Country",
        zipCode: "12345",
      } as AddressOrmVO,
      createdAt: new Date(),
    });
    await storeOrmRepository.save(storeOrmEntity);
  });

  it("should throw an error if invalid company ID", async () => {
    query = new GetStoresByCompanyIdQuery("invalid-company-id");

    await expect(sut.execute(query)).rejects.toThrow("Invalid UUID format.");
  });

  it("should throw an error if stores not found", async () => {
    await storeOrmRepository.clear();

    query = new GetStoresByCompanyIdQuery(ID.create().value);

    await expect(sut.execute(query)).rejects.toThrow(
      `No stores found for company with ID: ${query.companyId}.`,
    );
  });

  it("should return the store if found", async () => {
    query = new GetStoresByCompanyIdQuery(chainOrmEntity.companyId);

    const result = await sut.execute(query);

    expect(result).toEqual([
      {
        id: storeOrmEntity.id,
        chainId: storeOrmEntity.chainId,
        name: storeOrmEntity.name,
        description: storeOrmEntity.description,
        phone: storeOrmEntity.phone,

        address: {
          number: storeOrmEntity.address.number,
          street: storeOrmEntity.address.street,
          city: storeOrmEntity.address.city,
          state: storeOrmEntity.address.state,
          country: storeOrmEntity.address.country,
          zip: storeOrmEntity.address.zipCode,
        },

        document: {
          value: storeOrmEntity.document,
          type: "CNPJ",
          country: "BRAZIL",
        },

        createdAt: storeOrmEntity.createdAt
          .toISOString()
          .replace("T", " ")
          .replace("Z", ""),
        updatedAt: storeOrmEntity.updatedAt,
        disabledAt: storeOrmEntity.disabledAt,
      },
    ]);
  });
});
