import { ID } from "../value-objects/id.vo";
import Company from "./company";

describe("Company Entity", () => {
  it("should create a company with valid props", () => {
    const company = new Company({
      id: ID.create().value,
      partnerId: ID.create().value,
      name: "Test Company",
      description: "A company for testing",
      createdAt: Date.now(),
    });

    expect(company.id.value).toBeDefined();
    expect(company.partnerId.value).toBeDefined();
    expect(company.name.value).toBe("Test Company");
    expect(company.description.value).toBe("A company for testing");
    expect(company.createdAt).toBeDefined();
    expect(company.updatedAt).toBeUndefined();
    expect(company.disabledAt).toBeUndefined();
  });

  it("should not create a company with invalid props", () => {
    expect(() => {
      new Company({
        id: "1", // Invalid ID
        partnerId: "1", // Invalid ID
        name: "Test Company",
        description: "A company for testing",
        createdAt: Date.now(),
      });
    }).toThrow();
  });
});
