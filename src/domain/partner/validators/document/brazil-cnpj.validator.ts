import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import { DocumentValidator } from "./document-validator";

export class BrazilCNPJValidator implements DocumentValidator {
  validate(value: string): void {
    const cnpjRegex = /^\d{13,14}$/;
    if (!cnpjRegex.test(value)) {
      throw new DomainValidationError("Invalid CNPJ format");
    }
  }
}
