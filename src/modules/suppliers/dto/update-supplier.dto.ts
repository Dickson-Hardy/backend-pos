import { PartialType } from "@nestjs/swagger"
import { CreateSupplierDto } from "./create-supplier.dto"
import { IsOptional, IsString } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({ description: "Outlet ID" })
  @IsOptional()
  @IsString()
  outletId?: string
}