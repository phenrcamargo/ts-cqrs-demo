import { DomainValidationError } from "src/domain/shared/errors/domain.error";

export default class OrganizationName {
  private constructor(private readonly _value: string) {}

  static create(value: string): OrganizationName {
    OrganizationName.validate(value);

    return new OrganizationName(value);
  }

  public get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    if (value.length < 4 || value.length > 100) {
      throw new DomainValidationError(
        "Invalid organization name. Must be between 2 and 100 characters.",
      );
    }

    const nameRegex = /^[a-zA-Z0-9\s-]+$/;
    if (!nameRegex.test(value)) {
      throw new DomainValidationError(
        "Invalid organization name. Must contain only letters, numbers, hyphens, and spaces.",
      );
    }
  }
}
