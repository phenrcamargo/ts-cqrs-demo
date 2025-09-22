import { ID } from "../value-objects/id.vo";
import Partner from "./partner";

describe("Partner Entity", () => {
  it("should create a valid Partner with all required fields", () => {
    const partner = new Partner({
      id: ID.create().value,
      document: "12.345.678/0001-95", // Example CNPJ
      documentTypeCode: 2, // CNPJ
      countryCode: 1058, // Brazil
      name: "Test Partner",
      description: "Test Description",
      createdAt: Date.now(),
      updatedAt: undefined,
      disabledAt: undefined,
    });

    expect(partner.id.value).toBeDefined();
    expect(partner.name.value).toBe("Test Partner");
    expect(partner.description.value).toBe("Test Description");
    expect(partner.createdAt).toBeDefined();
    expect(partner.updatedAt).toBeUndefined();
    expect(partner.disabledAt).toBeUndefined();
  });

  it("should throw an error for invalid properties", () => {
    expect(() => {
      new Partner({
        id: "invalid-id",
        document: "12.345.678/0001-95", // Example CNPJ
        documentTypeCode: 2, // CNPJ
        countryCode: 1058, // Brazil
        name: "Test Partner",
        description: "Test Description",
        createdAt: Date.now(),
      });
    }).toThrow();
  });
});
