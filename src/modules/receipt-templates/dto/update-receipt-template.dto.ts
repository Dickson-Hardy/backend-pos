import { PartialType } from '@nestjs/mapped-types'
import { CreateReceiptTemplateDto } from './create-receipt-template.dto'
import { IsOptional, IsMongoId, IsBoolean, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateReceiptElementDto } from './create-receipt-element.dto'

export class UpdateReceiptTemplateDto extends PartialType(CreateReceiptTemplateDto) {
  @IsOptional()
  @IsMongoId()
  modifiedBy?: string

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceiptElementDto)
  elements?: CreateReceiptElementDto[]
}