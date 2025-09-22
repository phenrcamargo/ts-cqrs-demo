import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateDocumentDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  value?: string;

  @IsNumber()
  @IsOptional()
  countryCode?: number;

  @IsNumber()
  @IsOptional()
  typeCode?: number;
}
