import { IsString, IsEnum, IsOptional, IsArray, IsBoolean, IsObject, ValidateNested, IsMongoId } from 'class-validator'
import { Type } from 'class-transformer'
import { TemplateStatus } from '../../../schemas/receipt-template.schema'
import { CreateReceiptElementDto, CreatePaperConfigurationDto, CreatePrinterConfigurationDto } from './create-receipt-element.dto'

export class CreateReceiptTemplateDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus

  @IsMongoId()
  outletId: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceiptElementDto)
  elements?: CreateReceiptElementDto[]

  @ValidateNested()
  @Type(() => CreatePaperConfigurationDto)
  paperConfig: CreatePaperConfigurationDto

  @ValidateNested()
  @Type(() => CreatePrinterConfigurationDto)
  printerConfig: CreatePrinterConfigurationDto

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableVariables?: string[]

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>
}