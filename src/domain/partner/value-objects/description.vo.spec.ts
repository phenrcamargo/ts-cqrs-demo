import Description from "./description.vo";

describe("Description Value Object", () => {
  it("should create a valid Description", () => {
    const description = Description.create("This is a valid description.");
    expect(description.value).toBe("This is a valid description.");
  });

  it("should create an empty Description when created with undefined value", () => {
    const description = Description.create(undefined);
    expect(description.value).toBe("");
  });

  it("should throw an error for invalid Description", () => {
    expect(() => Description.create("Short")).toThrow(
      "Description must be at least 10 characters long.",
    );
  });
});
