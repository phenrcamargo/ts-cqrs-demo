import { DomainValidationError } from "src/domain/shared/errors/domain.error";

export default class Description {
  private constructor(private readonly _value: string) {}

  public static create(description: string | undefined): Description {
    if (!description) {
      return new Description("");
    }

    Description.validate(description);

    return new Description(description);
  }

  public get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    if (!value || value.length < 10) {
      throw new DomainValidationError(
        "Description must be at least 10 characters long.",
      );
    }
  }

  public equals(other: Description): boolean {
    return this._value === other._value;
  }
}
