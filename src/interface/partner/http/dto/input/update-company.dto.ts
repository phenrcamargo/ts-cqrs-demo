import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCompanyDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
