export class DefaultResponseDTO {
  constructor(
    private readonly statusCode: number,
    private readonly data: any,
  ) {}
}
