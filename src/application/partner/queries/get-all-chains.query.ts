import { Query } from "@nestjs/cqrs";

export type GetAllChainsResponse = {
  id: string;
  companyId: string;
  name: string;
  description: string;
  currency_code: number;
  country_code: number;
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
}[];

export class GetAllChainsQuery extends Query<GetAllChainsResponse> {
  constructor() {
    super();
  }
}
