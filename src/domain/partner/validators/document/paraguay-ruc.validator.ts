import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import { DocumentValidator } from "./document-validator";

export class ParaguayRUCValidator implements DocumentValidator {
  validate(value: string): void {
    const rucRegex = /^\d{7,9}$/;
    if (!rucRegex.test(value)) {
      throw new DomainValidationError("Invalid RUC format");
    }
  }
}
