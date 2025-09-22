import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import OrganizationName from "./organization-name.vo";

describe("Organization Name Value Object", () => {
  it("should create a valid organization name", () => {
    const name = OrganizationName.create("Organization - 1");
    expect(name.value).toBe("Organization - 1");
  });

  it("should throw an error for names shorter than 4 characters", () => {
    expect(() => OrganizationName.create("ABC")).toThrow(DomainValidationError);
  });

  it("should throw an error for names longer than 100 characters", () => {
    const longName = "A".repeat(101);
    expect(() => OrganizationName.create(longName)).toThrow(
      DomainValidationError,
    );
  });

  it("should throw an error for names with invalid characters", () => {
    expect(() => OrganizationName.create("John/123")).toThrow(
      DomainValidationError,
    );
    expect(() => OrganizationName.create("John!@#")).toThrow(
      DomainValidationError,
    );
  });
});
