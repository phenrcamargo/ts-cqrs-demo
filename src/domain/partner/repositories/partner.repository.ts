import Partner from "../entities/partner";
import { Document } from "../value-objects/document.vo";
import { ID } from "../value-objects/id.vo";

export const PartnerRepositoryToken = Symbol("PartnerRepository");

export interface PartnerRepository {
  findById(id: ID): Promise<Partner | undefined>;
  findByDocument(document: Document): Promise<Partner | undefined>;
  saveOrUpdate(partner: Partner): Promise<Partner>;
}
