import { IsString, IsNumber, IsArray, IsOptional, IsEnum, IsDateString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { PurchaseOrderPriority } from "../../../schemas/purchase-order.schema"

export class CreatePurchaseOrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNumber()
  unitCost: number

  @ApiProperty()
  @IsNumber()
  totalCost: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsString()
  supplierName: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierEmail?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierPhone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierAddress?: string

  @ApiProperty({ type: [CreatePurchaseOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items: CreatePurchaseOrderItemDto[]

  @ApiProperty()
  @IsNumber()
  subtotal: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tax?: number

  @ApiProperty()
  @IsNumber()
  total: number

  @ApiProperty({ enum: PurchaseOrderPriority, required: false })
  @IsOptional()
  @IsEnum(PurchaseOrderPriority)
  priority?: PurchaseOrderPriority

  @ApiProperty()
  @IsDateString()
  orderDate: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty()
  @IsString()
  outletId: string
}