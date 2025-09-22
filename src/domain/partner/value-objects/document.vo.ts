import {
  Country,
  getCountryByCode,
} from "src/domain/shared/enums/country.enum";
import { DocumentValidatorFactory } from "../factories/document-validator.factory";
import {
  DocumentType,
  getDocumentTypeByCode,
} from "src/domain/shared/enums/document-type.enum";

export type CreateDocumentParams = {
  value: string;
  countryCode: number;
  typeCode: number;
};

export class Document {
  private constructor(
    private readonly _value: string,
    private readonly _country: Country,
    private readonly _type: DocumentType,
  ) {}

  public static create(params: CreateDocumentParams): Document {
    const normalizedValue = this.normalize(params.value);
    const country = getCountryByCode(params.countryCode);
    const type = getDocumentTypeByCode(params.typeCode);
    const validator = DocumentValidatorFactory.getValidator(country, type);
    validator.validate(normalizedValue);

    return new Document(normalizedValue, country, type);
  }

  public static update(
    document: Document,
    params: Partial<CreateDocumentParams>,
  ): Document {
    const updateParams = {
      value: params.value ?? document._value,
      countryCode: params.countryCode ?? document._country,
      typeCode: params.typeCode ?? document._type,
    };

    const normalizedValue = this.normalize(updateParams.value);
    const country = getCountryByCode(updateParams.countryCode);
    const type = getDocumentTypeByCode(updateParams.typeCode);
    const validator = DocumentValidatorFactory.getValidator(country, type);
    validator.validate(normalizedValue);

    return new Document(normalizedValue, country, type);
  }

  private static normalize(value: string): string {
    return value.replace(/[^0-9]/g, "");
  }

  get value(): string {
    return this._value;
  }

  get country(): Country {
    return this._country;
  }

  get type(): DocumentType {
    return this._type;
  }
}
