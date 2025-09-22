import { ID } from "./id.vo";
import { validate as uuidValidate } from "uuid";

describe("ID Value Object", () => {
  it("should create a valid ID with a provided UUID", () => {
    const id = ID.create("123e4567-e89b-12d3-a456-426614174000");
    expect(id.value).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("should create a valid ID with a generated UUID", () => {
    const id = ID.create();
    expect(uuidValidate(id.value)).toBe(true);
  });

  it("should throw an error for invalid UUID format", () => {
    expect(() => ID.create("invalid-uuid")).toThrow("Invalid UUID format.");
  });
});
