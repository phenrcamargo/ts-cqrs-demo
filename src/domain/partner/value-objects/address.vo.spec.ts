import Address from "./address.vo";

describe("Address Value Object", () => {
  it("should create a valid address", () => {
    const address = Address.create({
      number: 123,
      street: "Main St",
      city: "Springfield",
      state: "IL",
      country: "USA",
      zipCode: "62701",
      latitude: 39.7817,
      longitude: -89.6501,
    });

    expect(address.number).toBe(123);
    expect(address.street).toBe("Main St");
    expect(address.city).toBe("Springfield");
    expect(address.state).toBe("IL");
    expect(address.country).toBe("USA");
    expect(address.zipCode).toBe("62701");
    expect(address.latitude).toBe(39.7817);
    expect(address.longitude).toBe(-89.6501);
  });

  it("should throw an error for invalid address properties", () => {
    expect(() =>
      Address.create({
        number: -1,
        street: "Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
      }),
    ).toThrow("Number must be a positive integer.");
  });

  it("should throw an error for invalid zip code", () => {
    expect(() =>
      Address.create({
        number: 123,
        street: "Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "invalid-zip",
      }),
    ).toThrow("Invalid zip code format.");
  });

  it("should throw an error for invalid latitude", () => {
    expect(() =>
      Address.create({
        number: 123,
        street: "Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
        latitude: 100,
      }),
    ).toThrow("Latitude must be between -90 and 90 degrees.");
  });

  it("should throw an error for invalid longitude", () => {
    expect(() =>
      Address.create({
        number: 123,
        street: "Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
        longitude: 200,
      }),
    ).toThrow("Longitude must be between -180 and 180 degrees.");
  });
});
