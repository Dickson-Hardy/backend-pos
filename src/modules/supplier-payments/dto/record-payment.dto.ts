import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDateString } from "class-validator"
import { PaymentMethod } from "../../../schemas/supplier-payment.schema"

export class RecordPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @IsNotEmpty()
  @IsDateString()
  paidDate: string

  @IsOptional()
  @IsString()
  referenceNumber?: string

  @IsOptional()
  @IsString()
  notes?: string
}
