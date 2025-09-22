import { DomainValidationError } from "src/domain/shared/errors/domain.error";

export default class Phone {
  private constructor(private readonly _value: string) {}

  static create(value: string): Phone {
    Phone.validate(value);

    return new Phone(value);
  }

  public get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    const phoneRegex = /^\+?\d{1,3}[-\s]?\d{2,3}[-\s]?\d{3,5}[-\s]?\d{4}$/;
    if (!phoneRegex.test(value)) {
      throw new DomainValidationError("Invalid phone number");
    }
  }

  public equals(other: Phone): boolean {
    return this._value === other._value;
  }
}
