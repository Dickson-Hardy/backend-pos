import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class TransferItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string

  @IsNotEmpty()
  @IsString()
  productName: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsOptional()
  @IsString()
  batchNumber?: string
}

export class CreateTransferDto {
  @IsNotEmpty()
  @IsString()
  fromOutletId: string

  @IsNotEmpty()
  @IsString()
  toOutletId: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[]

  @IsOptional()
  @IsString()
  notes?: string
}
