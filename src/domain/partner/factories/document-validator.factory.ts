import { Country } from "src/domain/shared/enums/country.enum";
import { DocumentValidator } from "../validators/document/document-validator";
import { BrazilCNPJValidator } from "../validators/document/brazil-cnpj.validator";
import { ParaguayRUCValidator } from "../validators/document/paraguay-ruc.validator";
import { UsaEINValidator } from "../validators/document/usa-ein.validator";
import { DocumentType } from "src/domain/shared/enums/document-type.enum";
import { DomainError } from "src/domain/shared/errors/domain.error";

export class DocumentValidatorFactory {
  static validators: Partial<
    Record<`${Country}_${DocumentType}`, DocumentValidator>
  > = {
    [`${Country.BRAZIL}_${DocumentType.CNPJ}`]: new BrazilCNPJValidator(),
    [`${Country.PARAGUAY}_${DocumentType.RUC}`]: new ParaguayRUCValidator(),
    [`${Country.USA}_${DocumentType.EIN}`]: new UsaEINValidator(),
  };

  static getValidator(
    country: Country,
    documentType: DocumentType,
  ): DocumentValidator {
    const validator = this.validators[`${country}_${documentType}`];

    if (!validator) {
      throw new DomainError(
        `No validator available for ${country} with type ${documentType}`,
      );
    }

    return validator;
  }
}
