import Description from "../value-objects/description.vo";
import { ID } from "../value-objects/id.vo";
import OrganizationName from "../value-objects/organization-name.vo";

type CompanyProps = {
  id?: string;
  partnerId: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
  disabledAt?: number;
};

export default class Company {
  #id: ID;
  #partnerId: ID;
  #name: OrganizationName;
  #description: Description;
  #createdAt: number;
  #updatedAt: number | undefined;
  #disabledAt: number | undefined;

  constructor(props: CompanyProps) {
    this.#id = props.id ? ID.create(props.id) : ID.create();
    this.#partnerId = ID.create(props.partnerId);
    this.#name = OrganizationName.create(props.name);
    this.#description = Description.create(props.description);
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt ? props.updatedAt : undefined;
    this.#disabledAt = props.disabledAt ? props.disabledAt : undefined;
  }

  get id(): ID {
    return this.#id;
  }

  get partnerId(): ID {
    return this.#partnerId;
  }

  get name(): OrganizationName {
    return this.#name;
  }

  get description(): Description {
    return this.#description;
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

  updateDetails(params: { name?: string; description?: string }) {
    if (params.name) this.#name = OrganizationName.create(params.name);
    if (params.description)
      this.#description = Description.create(params.description);

    this.#updatedAt = Date.now();
  }

  delete() {
    this.#updatedAt = Date.now();
    this.#disabledAt = Date.now();
  }
}
