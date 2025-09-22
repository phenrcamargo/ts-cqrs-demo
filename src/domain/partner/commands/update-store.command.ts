import { Command } from "@nestjs/cqrs";

export type UpdatedStoreDTO = {
  name?: string;
  description?: string;
  phone?: string;
  address?: {
    number?: number;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  };
};
export default class UpdateStoreCommand extends Command<UpdatedStoreDTO> {
  constructor(
    public readonly storeId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly phone?: string,
    public readonly address?: {
      number?: number;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    super();
  }
}
