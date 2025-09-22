/* eslint-disable prettier/prettier */
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateDocumentDTO } from "./update-document.dto";
import { Type } from "class-transformer";

export class UpdatePartnerDTO {    
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @ValidateNested()
    @Type(() => UpdateDocumentDTO)
    @IsOptional()
    document?: UpdateDocumentDTO;
}
