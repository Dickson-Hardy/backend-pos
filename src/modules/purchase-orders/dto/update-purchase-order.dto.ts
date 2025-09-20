import { PartialType } from "@nestjs/swagger"
import { IsOptional, IsEnum, IsDateString, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CreatePurchaseOrderDto } from "./create-purchase-order.dto"
import { PurchaseOrderStatus } from "../../../schemas/purchase-order.schema"

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {
  @ApiProperty({ enum: PurchaseOrderStatus, required: false })
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  approvedBy?: string
}