export class ResourceUpdatedDTO {
  constructor(
    public id: string,
    public updatedResource: any,
    public _links: { self: string },
  ) {}
}
