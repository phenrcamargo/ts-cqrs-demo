import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateAddressDTO } from "./create-address.dto";

export class CreateStoreDTO {
  @IsString()
  @IsNotEmpty()
  chainId!: string;

  @IsString()
  @IsNotEmpty()
  document!: string;

  @IsNumber()
  @IsPositive()
  documentTypeCode!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ValidateNested()
  @Type(() => CreateAddressDTO)
  address!: CreateAddressDTO;
}
