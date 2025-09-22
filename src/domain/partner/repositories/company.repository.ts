import Company from "../entities/company";
import { ID } from "../value-objects/id.vo";

export const CompanyRepositoryToken = Symbol("CompanyRepository");

export interface CompanyRepository {
  findById(id: ID): Promise<Company | undefined>;
  findByPartnerId(partnerId: ID): Promise<Company[]>;
  saveOrUpdate(company: Company): Promise<Company>;
}
