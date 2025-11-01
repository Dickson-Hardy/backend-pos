import { IsNotEmpty, IsString, IsArray, IsEnum, IsOptional, ValidateNested, IsNumber } from "class-validator"
import { Type } from "class-transformer"
import { ReturnReason, RefundMethod } from "../../../schemas/return.schema"

export class ReturnItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string

  @IsNotEmpty()
  @IsString()
  productName: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number

  @IsNotEmpty()
  @IsNumber()
  totalRefund: number

  @IsNotEmpty()
  @IsEnum(ReturnReason)
  reason: ReturnReason

  @IsOptional()
  @IsString()
  batchNumber?: string
}

export class CreateReturnDto {
  @IsNotEmpty()
  @IsString()
  originalSaleId: string

  @IsNotEmpty()
  @IsString()
  originalReceiptNumber: string

  @IsNotEmpty()
  @IsString()
  outletId: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[]

  @IsNotEmpty()
  @IsNumber()
  totalRefundAmount: number

  @IsNotEmpty()
  @IsEnum(RefundMethod)
  refundMethod: RefundMethod

  @IsOptional()
  @IsString()
  customerName?: string

  @IsOptional()
  @IsString()
  customerPhone?: string

  @IsOptional()
  @IsString()
  notes?: string
}
