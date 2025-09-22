import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { UpdateAddressDTO } from "./update-address.dto";
import { Type } from "class-transformer";

export class UpdateStoreDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @Type(() => UpdateAddressDTO)
  @IsOptional()
  address?: UpdateAddressDTO;
}
