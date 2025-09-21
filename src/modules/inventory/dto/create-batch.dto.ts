import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateBatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batchNumber: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  outletId: string

  @ApiProperty()
  @IsDateString()
  manufacturingDate: string

  @ApiProperty()
  @IsDateString()
  expiryDate: string

  @ApiProperty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNumber()
  costPrice: number

  @ApiProperty()
  @IsNumber()
  sellingPrice: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierInvoice?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}


