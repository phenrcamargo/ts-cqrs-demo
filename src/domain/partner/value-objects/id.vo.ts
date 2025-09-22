import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class ID {
  private constructor(private readonly _value: string) {}

  public static create(id?: string): ID {
    if (id) {
      ID.validate(id);

      return new ID(id);
    }

    return new ID(uuidv4());
  }

  public get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    if (!uuidValidate(value)) {
      throw new DomainValidationError("Invalid UUID format.");
    }
  }

  public equals(other: ID): boolean {
    return this._value === other._value;
  }
}
