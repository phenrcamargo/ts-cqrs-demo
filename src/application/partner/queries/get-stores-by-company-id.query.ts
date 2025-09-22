import { Query } from "@nestjs/cqrs";

export type GetStoresByCompanyIdResponse = {
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

export class GetStoresByCompanyIdQuery extends Query<GetStoresByCompanyIdResponse> {
  constructor(public readonly companyId: string) {
    super();
  }
}
