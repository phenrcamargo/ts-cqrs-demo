import { DomainValidationError } from "../errors/domain.error";

export enum Country {
  BRAZIL = 1058,
  PARAGUAY = 5860,
  USA = 2496,
}

const countryCodes = new Set<number>(
  Object.values(Country).filter((v) => typeof v === "number") as number[],
);

export function getCountryByCode(code: number): Country {
  if (!countryCodes.has(code)) {
    throw new DomainValidationError(`Invalid country code: ${code}`);
  }
  return code as Country;
}

export function getCountryNameByCode(code: number): string {
  if (!countryCodes.has(code)) {
    throw new DomainValidationError(`Invalid country code: ${code}`);
  }
  return Country[code];
}
