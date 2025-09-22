export class ResourceCreatedDTO {
  constructor(
    public readonly id: string,
    public readonly _links: {
      self: string;
    },
  ) {}
}
