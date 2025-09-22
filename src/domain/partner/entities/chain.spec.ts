import { ID } from "../value-objects/id.vo";
import Chain from "./chain";

describe("Chain Entity", () => {
  it("should create a chain entity", () => {
    const chain = new Chain({
      id: ID.create().value,
      companyId: ID.create().value,
      name: "Chain 1",
      description: "Description 1",
      currencyCode: 986,
      countryCode: 1058,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      disabledAt: Date.now(),
    });

    expect(chain.id).toBeDefined();
    expect(chain.companyId).toBeDefined();
    expect(chain.name).toBeDefined();
    expect(chain.description).toBeDefined();
    expect(chain.currencyCode).toBeDefined();
    expect(chain.countryCode).toBeDefined();
    expect(chain.createdAt).toBeDefined();
    expect(chain.updatedAt).toBeDefined();
    expect(chain.disabledAt).toBeDefined();
  });

  it("should not throw an error if not required properties are missing", () => {
    expect(() => {
      new Chain({
        id: ID.create().value,
        companyId: ID.create().value,
        name: "Chain 1",
        description: "Description 1",
        currencyCode: 986,
        countryCode: 1058,
        createdAt: Date.now(),
        // Missing updatedAt and disabledAt
      });
    }).not.toThrow();
  });

  it("should throw an error for invalid properties", () => {
    expect(() => {
      new Chain({
        id: "invalid-id",
        companyId: "invalid-company-id",
        name: "Chain 1",
        description: "Description 1",
        currencyCode: -1, // Invalid currency code
        countryCode: 9999, // Invalid country code
        createdAt: Date.now(),
      });
    }).toThrow();
  });
});
