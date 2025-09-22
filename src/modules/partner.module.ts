import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartnerCommandHandlers } from "src/application/partner/command-handlers";
import { ChainRepositoryToken } from "src/domain/partner/repositories/chain.repository";
import { CompanyRepositoryToken } from "src/domain/partner/repositories/company.repository";
import { PartnerRepositoryToken } from "src/domain/partner/repositories/partner.repository";
import { StoreRepositoryToken } from "src/domain/partner/repositories/store.repository";
import { ChainOrmEntity } from "src/infrastructure/partner/persistence/typeorm/chain/chain.orm-entity";
import ChainRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/chain/chain.repository-impl";
import { CompanyOrmEntity } from "src/infrastructure/partner/persistence/typeorm/company/company.orm-entity";
import CompanyRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/company/company.repository-impl";
import { PartnerOrmEntity } from "src/infrastructure/partner/persistence/typeorm/partner/partner.orm-entity";
import PartnerRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/partner/partner.repository-impl";
import { StoreOrmEntity } from "src/infrastructure/partner/persistence/typeorm/store/store.orm-entity";
import StoreRepositoryImpl from "src/infrastructure/partner/persistence/typeorm/store/store.repository-impl";
import { PartnerQueryHandlers } from "src/infrastructure/partner/query-handlers";
import ChainController from "src/interface/partner/http/controllers/chain.controller";
import CompanyController from "src/interface/partner/http/controllers/company.controller";
import PartnerController from "src/interface/partner/http/controllers/partner.controller";
import StoreController from "src/interface/partner/http/controllers/store.controller";
import SharedModule from "src/modules/shared-module";

@Module({
  imports: [
    SharedModule,
    CqrsModule,
    TypeOrmModule.forFeature(
      [StoreOrmEntity, ChainOrmEntity, CompanyOrmEntity, PartnerOrmEntity],
      "core",
    ),
  ],
  providers: [
    ...PartnerCommandHandlers,
    ...PartnerQueryHandlers,
    {
      provide: PartnerRepositoryToken,
      useClass: PartnerRepositoryImpl,
    },
    {
      provide: ChainRepositoryToken,
      useClass: ChainRepositoryImpl,
    },
    {
      provide: CompanyRepositoryToken,
      useClass: CompanyRepositoryImpl,
    },
    {
      provide: StoreRepositoryToken,
      useClass: StoreRepositoryImpl,
    },
  ],
  controllers: [
    PartnerController,
    CompanyController,
    ChainController,
    StoreController,
  ],
})
export default class PartnerModule {}
