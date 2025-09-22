import { DomainValidationError } from "src/domain/shared/errors/domain.error";
import Phone from "./phone.vo";

describe("Phone Value-Object", () => {
  const phoneNumberTable = [
    "55 019 999999999",
    "55 019 99999-9999",
    "+55 11 91234-5678",
    "+1 212 555-1234",
  ];

  test.each(phoneNumberTable)(
    "should create a phone instance with phone number %s",
    (phoneNumber) => {
      const phone = Phone.create(phoneNumber);

      expect(phone.value).toBe(phoneNumber);
    },
  );

  it("should throw an error for invalid phone number", () => {
    expect(() => Phone.create("99999-9999")).toThrow(
      new DomainValidationError("Invalid phone number"),
    );
  });

  it("should be able to compare two phone instances", () => {
    const phone1 = Phone.create("55 019 999999999");
    const phone2 = Phone.create("55 019 999999999");
    const phone3 = Phone.create("55 019 888888888");

    expect(phone1.equals(phone2)).toBe(true);
    expect(phone1.equals(phone3)).toBe(false);
  });
});
