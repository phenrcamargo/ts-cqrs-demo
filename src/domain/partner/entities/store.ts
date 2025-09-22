/* eslint-disable prettier/prettier */
import Address, { AddressProps } from "../value-objects/address.vo";
import Description from "../value-objects/description.vo";
import { ID } from "../value-objects/id.vo";
import OrganizationName from "../value-objects/organization-name.vo";
import { Document } from "../value-objects/document.vo";
import Phone from "../value-objects/phone.vo";

type StoreProps = {
  id?: string;
  chainId: string;
  chainCountryCode: number;
  document: string;
  documentTypeCode: number;
  name: string;
  description?: string;
  phone: string;
  address: AddressProps;
  createdAt: number;
  updatedAt?: number | undefined;
  disabledAt?: number | undefined;
};

export default class Store {
  #id: ID;
  #chainId: ID;
  #document: Document;
  #name: OrganizationName;
  #description: Description;
  #phone: Phone;
  #address: Address;
  #createdAt: number;
  #updatedAt: number | undefined;
  #disabledAt: number | undefined;

  constructor(props: StoreProps) {
    this.#id = props.id ? ID.create(props.id) : ID.create();
    this.#chainId = ID.create(props.chainId);
    this.#document = Document.create({
      value: props.document,
      countryCode: props.chainCountryCode,
      typeCode: props.documentTypeCode,
    });
    this.#name = OrganizationName.create(props.name);
    this.#description = Description.create(props.description);
    this.#phone = Phone.create(props.phone);
    this.#address = Address.create(props.address);
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt ? props.updatedAt : undefined;
    this.#disabledAt = props.disabledAt ? props.disabledAt : undefined;
  }

  get id(): ID {
    return this.#id;
  }

  get chainId(): ID {
    return this.#chainId;
  }

  get document(): Document {
    return this.#document;
  }

  get name(): OrganizationName {
    return this.#name;
  }

  get description(): Description {
    return this.#description;
  }

  get phone(): Phone {
    return this.#phone;
  }

  get address(): Address {
    return this.#address;
  }

  get createdAt(): number {
    return this.#createdAt;
  }

  get updatedAt(): number | undefined {
    return this.#updatedAt;
  }

  get disabledAt(): number | undefined {
    return this.#disabledAt;
  }

  updateDetails(params: { name?: string; description?: string; phone?: string; address?: Partial<AddressProps>; }) {
    if (params.name) this.#name = OrganizationName.create(params.name);
    if (params.description) this.#description = Description.create(params.description);
    if (params.phone) this.#phone = Phone.create(params.phone);
    if (params.address) this.#address = Address.update(this.#address, params.address);

    this.#updatedAt = Date.now();
  }

  delete() {
    this.#updatedAt = Date.now();
    this.#disabledAt = Date.now();
  }
}
