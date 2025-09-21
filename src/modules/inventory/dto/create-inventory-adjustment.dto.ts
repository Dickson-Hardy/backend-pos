import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AdjustmentType } from "../../../schemas/inventory-adjustment.schema"

export class CreateInventoryAdjustmentDto {
  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsString()
  outletId: string

  @ApiProperty()
  @IsNumber()
  adjustedQuantity: number

  @ApiProperty()
  @IsString()
  reason: string

  @ApiProperty()
  @IsString()
  adjustedBy: string

  @ApiProperty({ enum: AdjustmentType })
  @IsEnum(AdjustmentType)
  type: AdjustmentType

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}