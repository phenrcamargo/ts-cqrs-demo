import { Command } from "@nestjs/cqrs";

export type UpdatedCompanyDTO = {
  companyId: string;
  name?: string;
  description?: string;
};

export default class UpdateCompanyCommand extends Command<UpdatedCompanyDTO> {
  constructor(
    public readonly companyId: string,
    public readonly name?: string,
    public readonly description?: string,
  ) {
    super();
  }
}
