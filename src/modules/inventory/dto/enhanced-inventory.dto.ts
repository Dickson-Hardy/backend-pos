import { ApiProperty } from "@nestjs/swagger"
import type { PackVariant } from "../../../schemas/pack-variant.schema"

export class PackInventoryBreakdownDto {
  @ApiProperty()
  variant: PackVariant

  @ApiProperty()
  availablePacks: number
}

export class EnhancedInventoryDto {
  @ApiProperty()
  productId: string

  @ApiProperty()
  productName: string

  @ApiProperty()
  totalUnits: number

  @ApiProperty({ type: [PackInventoryBreakdownDto] })
  packBreakdown: PackInventoryBreakdownDto[]

  @ApiProperty()
  looseUnits: number

  @ApiProperty()
  totalValue: number

  @ApiProperty()
  formattedDisplay: string

  @ApiProperty()
  reorderLevel: number

  @ApiProperty()
  maxStockLevel: number

  @ApiProperty()
  needsReorder: boolean
}