import Store from "../entities/store";
import { Document } from "../value-objects/document.vo";
import { ID } from "../value-objects/id.vo";

export const StoreRepositoryToken = Symbol("StoreRepository");

export interface StoreRepository {
  findById(id: ID): Promise<Store | undefined>;
  findByDocument(document: Document): Promise<Store | undefined>;
  findByChainId(chainId: ID): Promise<Store[]>;
  saveOrUpdate(store: Store): Promise<Store>;
}
