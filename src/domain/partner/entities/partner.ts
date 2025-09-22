import Description from "../value-objects/description.vo";
import { CreateDocumentParams, Document } from "../value-objects/document.vo";
import { ID } from "../value-objects/id.vo";
import OrganizationName from "../value-objects/organization-name.vo";

type PartnerProps = {
  id?: string;
  document: string;
  documentTypeCode: number;
  countryCode: number;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
  disabledAt?: number;
};

export default class Partner {
  #id: ID;
  #document: Document;
  #name: OrganizationName;
  #description: Description;
  #createdAt: number;
  #updatedAt?: number;
  #disabledAt?: number;

  constructor(props: PartnerProps) {
    this.#id = props.id ? ID.create(props.id) : ID.create();
    this.#document = Document.create({
      value: props.document,
      countryCode: props.countryCode,
      typeCode: props.documentTypeCode,
    });
    this.#name = OrganizationName.create(props.name);
    this.#description = Description.create(props.description);
    this.#createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
    this.#disabledAt = props.disabledAt;
  }

  get id(): ID {
    return this.#id;
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
    document?: Partial<CreateDocumentParams>;
  }) {
    if (params.name) this.#name = OrganizationName.create(params.name);
    if (params.description)
      this.#description = Description.create(params.description);
    if (params.document)
      this.#document = Document.update(this.#document, params.document);

    this.#updatedAt = Date.now();
  }

  delete() {
    this.#updatedAt = Date.now();
    this.#disabledAt = Date.now();
  }
}
