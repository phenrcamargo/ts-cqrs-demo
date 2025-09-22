import { Query } from "@nestjs/cqrs";

export type GetFullChainByIdResponse = {
  id: string;
  companyId: string;
  name: string;
  description: string;
  currency_code: number;
  country_code: number;
  stores: {
    id: string;
    chainId: string;
    name: string;
    description: string;
    phone: string;
    address: {
      number: number;
      street: string;
      city: string;
      state: string;
      country: string;
      zip: string;
    };
    document: {
      value: string;
      type: string;
      country: string;
    };
    createdAt: Date;
    updatedAt?: Date;
    disabledAt?: Date;
  }[];
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
};

export class GetFullChainByIdQuery extends Query<GetFullChainByIdResponse> {
  constructor(public readonly chainId: string) {
    super();
  }
}
