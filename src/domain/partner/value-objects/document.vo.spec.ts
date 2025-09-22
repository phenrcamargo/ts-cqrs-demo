import { Document } from "./document.vo";
import { Country } from "src/domain/shared/enums/country.enum";
import { DocumentType } from "src/domain/shared/enums/document-type.enum";
import { DomainValidationError } from "src/domain/shared/errors/domain.error";

describe("Document Value Object", () => {
  const rucTable = [
    {
      value: "80012345-6",
      normalizedValue: "800123456",
      countryCode: Country.PARAGUAY,
      typeCode: DocumentType.RUC,
    },
    {
      value: "1234567-8",
      normalizedValue: "12345678",
      countryCode: Country.PARAGUAY,
      typeCode: DocumentType.RUC,
    },
    {
      value: "564823570",
      normalizedValue: "564823570",
      countryCode: Country.PARAGUAY,
      typeCode: DocumentType.RUC,
    },
    {
      value: "64823571",
      normalizedValue: "64823571",
      countryCode: Country.PARAGUAY,
      typeCode: DocumentType.RUC,
    },
  ];

  const einTable = [
    {
      value: "12-3456789",
      normalizedValue: "123456789",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
    {
      value: "98-7654321",
      normalizedValue: "987654321",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
    {
      value: "57 - 4665298",
      normalizedValue: "574665298",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
    {
      value: "77-8101605",
      normalizedValue: "778101605",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
    {
      value: "36-5951831",
      normalizedValue: "365951831",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
    {
      value: "71-5084059",
      normalizedValue: "715084059",
      countryCode: Country.USA,
      typeCode: DocumentType.EIN,
    },
  ];

  const cnpjTable = [
    {
      value: "2952561000169",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
    {
      value: "12345678900010",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
    {
      value: "98765432100123",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
    {
      value: "07.658.772/0001-64",
      normalizedValue: "07658772000164",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
    {
      value: "58.994.058/0001-88",
      normalizedValue: "58994058000188",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
    {
      value: "88.988.999/0001-70",
      normalizedValue: "88988999000170",
      countryCode: Country.BRAZIL,
      typeCode: DocumentType.CNPJ,
    },
  ];

  test.each(rucTable)(
    "should create a valid document with RUC: %s",
    (documentParam) => {
      const document = Document.create(documentParam);
      expect(document.value).toBe(documentParam.normalizedValue);
      expect(document.country).toBe(documentParam.countryCode);
      expect(document.type).toBe(documentParam.typeCode);
    },
  );

  test.each(einTable)(
    "should create a valid document with EIN: %s",
    (documentParam) => {
      const document = Document.create(documentParam);
      expect(document.value).toBe(documentParam.normalizedValue);
      expect(document.country).toBe(documentParam.countryCode);
      expect(document.type).toBe(documentParam.typeCode);
    },
  );

  test.each(cnpjTable)(
    "should create a valid document with CNPJ: %s",
    (documentParam) => {
      const document = Document.create(documentParam);
      expect(document.value).toBe(
        documentParam.normalizedValue ?? documentParam.value,
      );
      expect(document.country).toBe(documentParam.countryCode);
      expect(document.type).toBe(documentParam.typeCode);
    },
  );

  it("should throw an error for invalid CNPJ", () => {
    expect(() =>
      Document.create({
        value: "12345678900",
        countryCode: Country.BRAZIL,
        typeCode: DocumentType.CNPJ,
      }),
    ).toThrow(new DomainValidationError("Invalid CNPJ format"));
  });

  it("should throw an error for invalid RUC", () => {
    expect(() =>
      Document.create({
        value: "1234567890",
        countryCode: Country.PARAGUAY,
        typeCode: DocumentType.RUC,
      }),
    ).toThrow(new DomainValidationError("Invalid RUC format"));
  });

  it("should throw an error for invalid EIN", () => {
    expect(() =>
      Document.create({
        value: "12345",
        countryCode: Country.USA,
        typeCode: DocumentType.EIN,
      }),
    ).toThrow(new DomainValidationError("Invalid EIN format"));
  });
});
