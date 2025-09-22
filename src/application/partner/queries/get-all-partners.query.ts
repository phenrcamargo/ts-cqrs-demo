import { Query } from "@nestjs/cqrs";

export type GetAllPartnersResponse = {
  id: string;
  name: string;
  description: string;
  document: {
    value: string;
    type: string;
    country: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
}[];

export class GetAllPartnersQuery extends Query<GetAllPartnersResponse> {
  constructor() {
    super();
  }
}
