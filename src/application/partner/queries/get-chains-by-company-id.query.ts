import { Query } from "@nestjs/cqrs";

export type GetChainsByCompanyIdResponse = {
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

export class GetChainsByCompanyIdQuery extends Query<GetChainsByCompanyIdResponse> {
  constructor(public readonly companyId: string) {
    super();
  }
}
