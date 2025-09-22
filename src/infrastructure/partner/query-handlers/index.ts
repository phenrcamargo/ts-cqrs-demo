import { GetAllChainsQueryHandler } from "./typeorm/get-all-chains.query-handler";
import { GetAllCompaniesQueryHandler } from "./typeorm/get-all-companies.query-handler";
import { GetAllPartnersQueryHandler } from "./typeorm/get-all-partners.query-handler";
import { GetAllStoresQueryHandler } from "./typeorm/get-all-stores.query-handler";
import { GetChainByIdQueryHandler } from "./typeorm/get-chain-by-id.query-handler";
import { GetChainsByCompanyIdQueryHandler } from "./typeorm/get-chains-by-company-id.query-handler";
import { GetCompanyByIdQueryHandler } from "./typeorm/get-company-by-id.query-handler";
import { GetFullChainByIdQueryHandler } from "./typeorm/get-full-chain-by-id.query-handler";
import { GetPartnerByIdQueryHandler } from "./typeorm/get-partner-by-id.query-handler";
import { GetStoreByIdQueryHandler } from "./typeorm/get-store-by-id.query-handler";
import { GetStoresByChainIdQueryHandler } from "./typeorm/get-stores-by-chain-id.query-handler";
import { GetStoresByCompanyIdQueryHandler } from "./typeorm/get-stores-by-company-id.query-handler";

export const PartnerQueryHandlers = [
  GetAllChainsQueryHandler,
  GetAllCompaniesQueryHandler,
  GetAllPartnersQueryHandler,
  GetAllStoresQueryHandler,
  GetChainByIdQueryHandler,
  GetChainsByCompanyIdQueryHandler,
  GetCompanyByIdQueryHandler,
  GetFullChainByIdQueryHandler,
  GetPartnerByIdQueryHandler,
  GetStoreByIdQueryHandler,
  GetStoresByChainIdQueryHandler,
  GetStoresByCompanyIdQueryHandler,
];
