import { Query } from "@nestjs/cqrs";

export type GetStoreByIdResponse = {
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
};

export class GetStoreByIdQuery extends Query<GetStoreByIdResponse> {
  constructor(public readonly storeId: string) {
    super();
  }
}
