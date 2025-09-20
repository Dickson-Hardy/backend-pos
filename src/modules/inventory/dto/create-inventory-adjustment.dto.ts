import { IsString, IsNumber, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}