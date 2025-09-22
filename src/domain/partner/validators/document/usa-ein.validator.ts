import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import { DocumentValidator } from "./document-validator";

export class UsaEINValidator implements DocumentValidator {
  validate(value: string): void {
    const einRegex = /^\d{9}$/;
    if (!einRegex.test(value)) {
      throw new DomainValidationError("Invalid EIN format");
    }
  }
}
