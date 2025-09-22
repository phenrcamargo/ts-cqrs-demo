import { DomainValidationError } from "../errors/domain.error";

export enum DocumentType {
  CPF = 1,
  CNPJ = 2,
  RUC = 3,
  CI = 4, //Cedula de Identidad
  PASSAPORT = 5,
  EIN = 6,
}

const documentTypeValues = new Set<number>(
  Object.values(DocumentType).filter((v) => typeof v === "number") as number[],
);

export function getDocumentTypeByCode(code: number): DocumentType {
  if (!documentTypeValues.has(code)) {
    throw new DomainValidationError(`Invalid document type code: ${code}`);
  }

  return code as DocumentType;
}

export function getDocumentTypeNameByCode(code: number): string {
  if (!documentTypeValues.has(code)) {
    throw new DomainValidationError(`Invalid document type code: ${code}`);
  }

  return DocumentType[code];
}
