import CreateChainCommandHandler from "./create-chain.command-handler";
import CreateCompanyCommandHandler from "./create-company.command-handler";
import CreatePartnerCommandHandler from "./create-partner.command-handler";
import DeleteChainCommandHandler from "./delete-chain.command-handler";
import DeleteCompanyCommandHandler from "./delete-company.command-handler";
import DeletePartnerCommandHandler from "./delete-partner.command-handler";
import DeleteStoreCommandHandler from "./delete-store.command-handler";
import UpdateChainCommandHandler from "./update-chain.command-handler";
import UpdateCompanyCommandHandler from "./update-company.command-handler";
import UpdatePartnerCommandHandler from "./update-partner.command-handler";
import UpdateStoreCommandHandler from "./update-store.command-handler";
import CreateStoreCommandHandler from "./create-store.command-handler";

export const PartnerCommandHandlers = [
  CreateChainCommandHandler,
  CreateCompanyCommandHandler,
  CreatePartnerCommandHandler,
  CreateStoreCommandHandler,
  DeleteChainCommandHandler,
  DeleteCompanyCommandHandler,
  DeletePartnerCommandHandler,
  DeleteStoreCommandHandler,
  UpdateChainCommandHandler,
  UpdateCompanyCommandHandler,
  UpdatePartnerCommandHandler,
  UpdateStoreCommandHandler,
];
