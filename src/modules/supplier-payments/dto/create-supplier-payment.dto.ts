import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from "class-validator"

export class CreateSupplierPaymentDto {
  @IsNotEmpty()
  @IsString()
  purchaseOrderId: string

  @IsNotEmpty()
  @IsString()
  supplierId: string

  @IsNotEmpty()
  @IsString()
  outletId: string

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number

  @IsNotEmpty()
  @IsDateString()
  dueDate: string

  @IsOptional()
  @IsString()
  notes?: string
}
