import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, ValidateNested, Min, Max } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { ProductCategory, UnitOfMeasure } from "../../../schemas/product.schema"
import { CreatePackVariantDto } from "./pack-variant.dto"

export class CreateProductDto {
  @ApiProperty({ example: "Paracetamol 500mg" })
  @IsString()
  name: string

  @ApiProperty({ example: "PCM500-001" })
  @IsString()
  sku: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  barcode?: string

  @ApiProperty({ example: "Pain relief medication", required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory

  @ApiProperty({ example: "PharmaCorp Ltd" })
  @IsString()
  manufacturer: string

  @ApiProperty({ example: "Paracetamol" })
  @IsString()
  genericName: string

  @ApiProperty({ example: "500mg" })
  @IsString()
  strength: string

  @ApiProperty({ enum: UnitOfMeasure })
  @IsEnum(UnitOfMeasure)
  unitOfMeasure: UnitOfMeasure

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @Min(1, { message: "Cost price must be at least 1 Le" })
  @Max(1500, { message: "Cost price cannot exceed 1500 Le" })
  costPrice: number

  @ApiProperty({ example: 15.75 })
  @IsNumber()
  @Min(1, { message: "Selling price must be at least 1 Le" })
  @Max(1500, { message: "Selling price cannot exceed 1500 Le" })
  sellingPrice: number

  @ApiProperty({ example: 100 })
  @IsNumber()
  stockQuantity: number

  @ApiProperty({ example: 20 })
  @IsNumber()
  reorderLevel: number

  @ApiProperty({ example: 500 })
  @IsNumber()
  maxStockLevel: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string

  @ApiProperty({ example: false })
  @IsBoolean()
  requiresPrescription: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activeIngredients?: string[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dosageInstructions?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storageInstructions?: string

  @ApiProperty()
  @IsString()
  outletId: string

  @ApiProperty({ example: true, description: "Whether individual units can be sold" })
  @IsOptional()
  @IsBoolean()
  allowUnitSale?: boolean

  @ApiProperty({ type: [CreatePackVariantDto], description: "Pack variants for this product", required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackVariantDto)
  packVariants?: CreatePackVariantDto[]
}
