import { Query } from "@nestjs/cqrs";

export type GetChainByIdResponse = {
  id: string;
  companyId: string;
  name: string;
  description: string;
  currency_code: number;
  country_code: number;
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
};

export class GetChainByIdQuery extends Query<GetChainByIdResponse> {
  constructor(public readonly chainId: string) {
    super();
  }
}
