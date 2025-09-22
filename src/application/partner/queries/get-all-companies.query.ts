import { Query } from "@nestjs/cqrs";

export type GetAllCompaniesResponse = {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  disabledAt?: Date;
}[];

export class GetAllCompaniesQuery extends Query<GetAllCompaniesResponse> {
  constructor() {
    super();
  }
}
