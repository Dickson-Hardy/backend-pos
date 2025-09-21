import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { PaymentMethod } from "../../../schemas/sale.schema"
import { CreateSalePackInfoDto } from "./sale-pack-info.dto"

export class SaleItemDto {
  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsString()
  productName: string

  @ApiProperty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNumber()
  unitPrice: number

  @ApiProperty()
  @IsNumber()
  totalPrice: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  batchNumber?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  discount?: number

  @ApiProperty({ type: CreateSalePackInfoDto, description: "Pack vs unit sale details", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSalePackInfoDto)
  packInfo?: CreateSalePackInfoDto
}

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  outletId: string

  @ApiProperty()
  @IsString()
  cashierId: string

  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[]

  @ApiProperty()
  @IsNumber()
  subtotal: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  discount?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  tax?: number

  @ApiProperty()
  @IsNumber()
  total: number

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prescriptionNumber?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  doctorName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}