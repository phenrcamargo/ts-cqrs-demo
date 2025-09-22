import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateDocumentDTO {
  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsNumber()
  countryCode!: number;

  @IsNumber()
  typeCode!: number;
}
