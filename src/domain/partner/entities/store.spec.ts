import { ID } from "../value-objects/id.vo";
import Store from "./store";

describe("Store Entity", () => {
  it("should create a valid Store with all required fields", () => {
    const store = new Store({
      id: ID.create().value,
      chainId: ID.create().value,
      chainCountryCode: 1058, // Brazil
      document: "12.345.678/0001-95", // Example CNPJ
      documentTypeCode: 2, // CNPJ
      name: "Test Store",
      description: "Test Description",
      phone: "55 019 999999999",
      address: {
        number: 123,
        street: "Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
        latitude: 39.7817,
        longitude: -89.6501,
      },
      createdAt: Date.now(),
      updatedAt: undefined,
      disabledAt: undefined,
    });

    expect(store.id.value).toBeDefined();
    expect(store.chainId.value).toBeDefined();
    expect(store.name.value).toBe("Test Store");
    expect(store.description.value).toBe("Test Description");
    expect(store.phone.value).toBe("55 019 999999999");
    expect(store.address.number).toBe(123);
    expect(store.address.street).toBe("Main St");
    expect(store.address.city).toBe("Springfield");
    expect(store.address.state).toBe("IL");
    expect(store.address.country).toBe("USA");
    expect(store.address.zipCode).toBe("62701");
    expect(store.address.latitude).toBe(39.7817);
    expect(store.address.longitude).toBe(-89.6501);
    expect(store.createdAt).toBeDefined();
    expect(store.updatedAt).toBeUndefined();
    expect(store.disabledAt).toBeUndefined();
  });
});
