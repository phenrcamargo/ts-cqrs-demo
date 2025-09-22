import { getCountryByCode } from "src/domain/shared/enums/country.enum";
import Description from "../value-objects/description.vo";
import { ID } from "../value-objects/id.vo";
import OrganizationName from "../value-objects/organization-name.vo";
import { getCurrencyByCode } from "src/domain/shared/enums/currency.enum";

type ChainProps = {
  id?: string;
  companyId: string;
  name: string;
  description?: string;
  currencyCode: number;
  countryCode: number;
  createdAt: number;
  updatedAt?: number;
  disabledAt?: number;
};

export default class Chain {
  #id: ID;
  #companyId: ID;
  #name: OrganizationName;
  #description: Description;
  #currencyCode: number;
  #countryCode: number;
  #createdAt: number;
  #updatedAt: number | undefined;
  #disabledAt: number | undefined;

  constructor(props: ChainProps) {
    this.#id = props.id ? ID.create(props.id) : ID.create();
    this.#companyId = ID.create(props.companyId);
    this.#name = OrganizationName.create(props.name);
    this.#description = Description.create(props.description);
    this.#currencyCode = getCurrencyByCode(props.currencyCode);
    this.#countryCode = getCountryByCode(props.countryCode);
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
    this.#disabledAt = props.disabledAt;
  }

  get id(): ID {
    return this.#id;
  }

  get companyId(): ID {
    return this.#companyId;
  }

  get name(): OrganizationName {
    return this.#name;
  }

  get description(): Description {
    return this.#description;
  }

  get currencyCode(): number {
    return this.#currencyCode;
  }

  get countryCode(): number {
    return this.#countryCode;
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

  updateDetails(params: {
    name?: string;
    description?: string;
    countryCode?: number;
    currencyCode?: number;
  }) {
    if (params.name) this.#name = OrganizationName.create(params.name);
    if (params.description)
      this.#description = Description.create(params.description);
    if (params.countryCode)
      this.#countryCode = getCountryByCode(params.countryCode);
    if (params.currencyCode)
      this.#currencyCode = getCurrencyByCode(params.currencyCode);

    this.#updatedAt = Date.now();
  }

  delete() {
    this.#updatedAt = Date.now();
    this.#disabledAt = Date.now();
  }
}
