/* eslint-disable @typescript-eslint/require-await */
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { StoreOrmEntity } from "../partner/persistence/typeorm/store/store.orm-entity";
import { ChainOrmEntity } from "../partner/persistence/typeorm/chain/chain.orm-entity";
import { CompanyOrmEntity } from "../partner/persistence/typeorm/company/company.orm-entity";
import { PartnerOrmEntity } from "../partner/persistence/typeorm/partner/partner.orm-entity";

const inProduction = process.env.NODE_ENV === "production";

export const eventStoreConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  name: "eventStore",
  type: "postgres",
  host: configService.get<string>("EVENT_STORE_DB_HOST"),
  port: configService.get<number>("EVENT_STORE_DB_PORT"),
  username: configService.get<string>("EVENT_STORE_DB_USERNAME"),
  password: configService.get<string>("EVENT_STORE_DB_PASSWORD"),
  database: configService.get<string>("EVENT_STORE_DB_NAME"),
  logging: !inProduction,
  synchronize: !inProduction,
});

export const coreDbConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  name: "core",
  type: "postgres",
  host: configService.get<string>("CORE_DB_HOST"),
  port: configService.get<number>("CORE_DB_PORT"),
  username: configService.get<string>("CORE_DB_USERNAME"),
  password: configService.get<string>("CORE_DB_PASSWORD"),
  database: configService.get<string>("CORE_DB_NAME"),
  logging: !inProduction,
  synchronize: !inProduction,
  entities: [
    StoreOrmEntity,
    ChainOrmEntity,
    CompanyOrmEntity,
    PartnerOrmEntity,
  ],
});
