import { DomainValidationError } from "src/domain/shared/errors/domain.error";

export type AddressProps = {
  number: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
};

export default class Address {
  private constructor(private readonly props: AddressProps) {}

  get number() {
    return this.props.number;
  }
  get street() {
    return this.props.street;
  }
  get city() {
    return this.props.city;
  }
  get state() {
    return this.props.state;
  }
  get country() {
    return this.props.country;
  }
  get zipCode() {
    return this.props.zipCode;
  }
  get latitude() {
    return this.props.latitude;
  }
  get longitude() {
    return this.props.longitude;
  }

  public static create(props: AddressProps): Address {
    Address.validate(props);

    return new Address(props);
  }

  public static update(
    address: Address,
    props: Partial<AddressProps>,
  ): Address {
    const updatedProps = {
      ...address.props,
      ...props,
    };

    Address.validate(updatedProps);

    return new Address(updatedProps);
  }

  static validate(props: AddressProps): void {
    if (props.number <= 0) {
      throw new DomainValidationError("Number must be a positive integer.");
    }

    this.validateLocalName(props.street, "street");
    this.validateLocalName(props.city, "city");
    this.validateLocalName(props.state, "state");
    this.validateLocalName(props.country, "country");

    this.validateZipCode(props.zipCode);
    this.validateLatitude(props.latitude);
    this.validateLongitude(props.longitude);
  }

  private static validateLocalName(
    value: string,
    localType: "street" | "city" | "state" | "country",
  ): void {
    const localNameRegex = /^[a-zA-Z\s]+$/;
    if (!value || value.length < 2 || !localNameRegex.test(value)) {
      throw new DomainValidationError(
        `Invalid ${localType} format. It must contain only letters and spaces and be at least 2 characters long.`,
      );
    }
  }

  private static validateZipCode(zipCode: string): void {
    const zipCodeRegex = /^(?:\d{5}(?:-\d{4})?|\d{8}|\d{5}-\d{3}|\d{4})$/;
    if (!zipCodeRegex.test(zipCode)) {
      throw new DomainValidationError("Invalid zip code format.");
    }
  }

  private static validateLatitude(latitude?: number): void {
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw new DomainValidationError(
        "Latitude must be between -90 and 90 degrees.",
      );
    }
  }

  private static validateLongitude(longitude?: number): void {
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw new DomainValidationError(
        "Longitude must be between -180 and 180 degrees.",
      );
    }
  }
}
