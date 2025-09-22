import { DomainValidationError } from "../errors/domain.error";

export enum Currency {
  USD = 840,
  EUR = 978,
  GBP = 826,
  BRL = 986,
  PYG = 600,
}

export enum CurrencySymbol {
  USD = "$",
  EUR = "€",
  GBP = "£",
  BRL = "R$",
  PYG = "Gs",
}

const currencyCodes = new Set<number>(
  Object.values(Currency).filter((v) => typeof v === "number") as number[],
);

export function getCurrencyByCode(code: number): Currency {
  if (!currencyCodes.has(code)) {
    throw new DomainValidationError(`Invalid currency code: ${code}`);
  }

  return code as Currency;
}
