import { Query } from "@nestjs/cqrs";

export type GetStoresByChainIdResponse = {
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

export class GetStoresByChainIdQuery extends Query<GetStoresByChainIdResponse> {
  constructor(public readonly chainId: string) {
    super();
  }
}
