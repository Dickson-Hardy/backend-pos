import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { TextAlignment, FontSize, FontStyle } from '../../../schemas/receipt-template.schema'

export class CreateReceiptElementDto {
  @IsString()
  type: string

  @IsString()
  content: string

  @IsOptional()
  @IsEnum(TextAlignment)
  alignment?: TextAlignment

  @IsOptional()
  @IsEnum(FontSize)
  fontSize?: FontSize

  @IsOptional()
  @IsEnum(FontStyle)
  fontStyle?: FontStyle

  @IsOptional()
  @IsBoolean()
  bold?: boolean

  @IsOptional()
  @IsBoolean()
  underline?: boolean

  @IsOptional()
  @IsNumber()
  height?: number

  @IsOptional()
  @IsNumber()
  marginTop?: number

  @IsOptional()
  @IsNumber()
  marginBottom?: number

  @IsOptional()
  @IsObject()
  properties?: Record<string, any>
}

export class CreatePaperConfigurationDto {
  @IsNumber()
  width: number

  @IsOptional()
  @IsString()
  unit?: string

  @IsOptional()
  @IsNumber()
  physicalWidth?: number

  @IsOptional()
  @IsNumber()
  physicalHeight?: number
}

export class CreatePrinterConfigurationDto {
  @IsString()
  type: string

  @IsString()
  model: string

  @IsString()
  connectionType: string

  @IsOptional()
  @IsString()
  commandSet?: string

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>
}