import { Query } from "@nestjs/cqrs";

export type GetCompanyByIdResponse = {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
};

export class GetCompanyByIdQuery extends Query<GetCompanyByIdResponse> {
  constructor(public readonly companyId: string) {
    super();
  }
}
