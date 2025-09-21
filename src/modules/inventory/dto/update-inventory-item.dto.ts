import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"

export class UpdateInventoryItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxStockLevel?: number
}


