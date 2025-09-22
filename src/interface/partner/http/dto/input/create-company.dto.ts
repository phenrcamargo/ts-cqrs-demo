import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompanyDTO {
  @IsString()
  @IsNotEmpty()
  partnerId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
