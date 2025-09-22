import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateDocumentDTO } from "./create-document.dto";
import { Type } from "class-transformer";

export class CreatePartnerDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => CreateDocumentDTO)
  document!: CreateDocumentDTO;
}
