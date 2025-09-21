import { IsString, IsNumber, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreatePackVariantDto {
  @ApiProperty({ example: 3, description: "Number of units in this pack" })
  @IsNumber()
  packSize: number

  @ApiProperty({ example: 3000, description: "Price for the entire pack" })
  @IsNumber()
  packPrice: number

  @ApiProperty({ example: 1000, description: "Price per individual unit in this pack" })
  @IsNumber()
  unitPrice: number

  @ApiProperty({ example: true, description: "Whether this pack variant is active" })
  @IsBoolean()
  isActive: boolean

  @ApiProperty({ example: "3-pack", description: "Optional name for the pack variant", required: false })
  @IsOptional()
  @IsString()
  name?: string
}

export class UpdatePackVariantDto {
  @ApiProperty({ example: 3, description: "Number of units in this pack", required: false })
  @IsOptional()
  @IsNumber()
  packSize?: number

  @ApiProperty({ example: 3000, description: "Price for the entire pack", required: false })
  @IsOptional()
  @IsNumber()
  packPrice?: number

  @ApiProperty({ example: 1000, description: "Price per individual unit in this pack", required: false })
  @IsOptional()
  @IsNumber()
  unitPrice?: number

  @ApiProperty({ example: true, description: "Whether this pack variant is active", required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ example: "3-pack", description: "Optional name for the pack variant", required: false })
  @IsOptional()
  @IsString()
  name?: string
}