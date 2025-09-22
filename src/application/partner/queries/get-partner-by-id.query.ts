import { Query } from "@nestjs/cqrs";

export type GetPartnerByIdResponse = {
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
};

export class GetPartnerByIdQuery extends Query<GetPartnerByIdResponse> {
  constructor(public readonly partnerId: string) {
    super();
  }
}
