import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsArray, Min, Max } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { SupplierStatus } from "../../../schemas/supplier.schema"

export class CreateSupplierDto {
  @ApiProperty({ description: "Supplier name" })
  @IsString()
  name: string

  @ApiProperty({ description: "Contact person name" })
  @IsString()
  contactPerson: string

  @ApiProperty({ description: "Email address" })
  @IsEmail()
  email: string

  @ApiProperty({ description: "Phone number" })
  @IsString()
  phone: string

  @ApiProperty({ description: "Physical address" })
  @IsString()
  address: string

  @ApiPropertyOptional({ enum: SupplierStatus, default: SupplierStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus

  @ApiPropertyOptional({ description: "Supplier rating (0-5)", minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number

  @ApiPropertyOptional({ description: "Payment terms", default: "30 days" })
  @IsOptional()
  @IsString()
  paymentTerms?: string

  @ApiPropertyOptional({ description: "Website URL" })
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional({ description: "Tax identification number" })
  @IsOptional()
  @IsString()
  taxId?: string

  @ApiPropertyOptional({ description: "Bank account details" })
  @IsOptional()
  @IsString()
  bankDetails?: string

  @ApiPropertyOptional({ description: "Additional notes" })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({ description: "Product categories supplied", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[]

  @ApiProperty({ description: "Outlet ID" })
  @IsString()
  outletId: string
}