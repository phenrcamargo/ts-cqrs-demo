import { Command } from "@nestjs/cqrs";

export type UpdatedPartnerDTO = {
  name: string;
  description: string;
  document: {
    value: string;
    countryCode: number;
    typeCode: number;
  };
  updatedAt: Date;
};

export default class UpdatePartnerCommand extends Command<UpdatedPartnerDTO> {
  constructor(
    public readonly partnerId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly document?: {
      value?: string;
      countryCode?: number;
      typeCode?: number;
    },
  ) {
    super();
  }
}
