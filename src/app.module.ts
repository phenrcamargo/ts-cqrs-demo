import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  eventStoreConfig,
  coreDbConfig,
} from "./infrastructure/config/typeorm.config";
import PartnerModule from "./modules/partner.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
    }),
    TypeOrmModule.forRootAsync({
      name: "eventStore",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: eventStoreConfig,
    }),
    TypeOrmModule.forRootAsync({
      name: "core",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: coreDbConfig,
    }),
    PartnerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
