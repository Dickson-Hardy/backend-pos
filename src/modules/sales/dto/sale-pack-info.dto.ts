import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { SaleType } from "../../../schemas/sale-pack-info.schema"

export class CreateSalePackInfoDto {
  @ApiProperty({ enum: SaleType, example: SaleType.PACK })
  @IsEnum(SaleType)
  saleType: SaleType

  @ApiProperty({ example: "64f1234567890abcdef12345", description: "Pack variant ID (if pack sale)", required: false })
  @IsOptional()
  @IsString()
  packVariantId?: string

  @ApiProperty({ example: 2, description: "Number of packs sold", required: false })
  @IsOptional()
  @IsNumber()
  packQuantity?: number

  @ApiProperty({ example: 1, description: "Number of individual units sold", required: false })
  @IsOptional()
  @IsNumber()
  unitQuantity?: number

  @ApiProperty({ example: 6, description: "Total units for inventory deduction" })
  @IsNumber()
  effectiveUnitCount: number
}