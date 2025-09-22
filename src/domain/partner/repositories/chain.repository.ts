import Chain from "../entities/chain";
import { ID } from "../value-objects/id.vo";

export const ChainRepositoryToken = Symbol("ChainRepository");

export interface ChainRepository {
  findById(id: ID): Promise<Chain | undefined>;
  findByCompanyId(companyId: ID): Promise<Chain[]>;
  saveOrUpdate(chain: Chain): Promise<Chain>;
}
