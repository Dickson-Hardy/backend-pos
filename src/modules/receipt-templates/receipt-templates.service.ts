import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { Types } from 'mongoose'
import { ReceiptTemplate, type ReceiptTemplateDocument, TemplateStatus } from '../../schemas/receipt-template.schema'
import { CreateReceiptTemplateDto } from './dto/create-receipt-template.dto'
import { UpdateReceiptTemplateDto } from './dto/update-receipt-template.dto'

@Injectable()
export class ReceiptTemplatesService {
  constructor(
    @InjectModel(ReceiptTemplate.name)
    private receiptTemplateModel: Model<ReceiptTemplateDocument>
  ) {}

  async create(createReceiptTemplateDto: CreateReceiptTemplateDto, userId: string): Promise<ReceiptTemplate> {
    // If this template is set as default, remove default from other templates in the same outlet
    if (createReceiptTemplateDto.isDefault) {
      await this.receiptTemplateModel.updateMany(
        { outletId: createReceiptTemplateDto.outletId, isDefault: true },
        { isDefault: false }
      )
    }

    const template = new this.receiptTemplateModel({
      ...createReceiptTemplateDto,
      createdBy: userId,
      version: 1
    })

    return template.save()
  }

  async findAll(outletId?: string, status?: TemplateStatus): Promise<ReceiptTemplate[]> {
    const filter: any = {}
    
    if (outletId) {
      filter.outletId = outletId
    }
    
    if (status) {
      filter.status = status
    }

    return this.receiptTemplateModel
      .find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('modifiedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<ReceiptTemplate> {
    const template = await this.receiptTemplateModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('modifiedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .exec()

    if (!template) {
      throw new NotFoundException(`Receipt template with ID ${id} not found`)
    }

    return template
  }

  async findDefault(outletId: string): Promise<ReceiptTemplate> {
    const template = await this.receiptTemplateModel
      .findOne({ outletId, isDefault: true, status: TemplateStatus.ACTIVE })
      .populate('createdBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .exec()

    if (!template) {
      throw new NotFoundException(`No default receipt template found for outlet ${outletId}`)
    }

    return template
  }

  async update(id: string, updateReceiptTemplateDto: UpdateReceiptTemplateDto, userId: string): Promise<ReceiptTemplate> {
    const existingTemplate = await this.findOne(id)

    // Prevent modification of system templates
    if (existingTemplate.isSystem) {
      throw new BadRequestException('System templates cannot be modified')
    }

    // If this template is set as default, remove default from other templates in the same outlet
    if (updateReceiptTemplateDto.isDefault) {
      await this.receiptTemplateModel.updateMany(
        { outletId: existingTemplate.outletId, isDefault: true, _id: { $ne: id } },
        { isDefault: false }
      )
    }

    // Increment version if elements are modified
    let versionIncrement = 0
    if (updateReceiptTemplateDto.elements && updateReceiptTemplateDto.elements.length > 0) {
      versionIncrement = 1
    }

    const updatedTemplate = await this.receiptTemplateModel
      .findByIdAndUpdate(
        id,
        {
          ...updateReceiptTemplateDto,
          modifiedBy: userId,
          $inc: { version: versionIncrement }
        },
        { new: true }
      )
      .populate('createdBy', 'firstName lastName email')
      .populate('modifiedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .exec()

    return updatedTemplate
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id)

    // Prevent deletion of system templates
    if (template.isSystem) {
      throw new BadRequestException('System templates cannot be deleted')
    }

    // Prevent deletion of active default templates
    if (template.isDefault && template.status === TemplateStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active default template. Set another template as default first.')
    }

    await this.receiptTemplateModel.findByIdAndDelete(id)
  }

  async duplicate(id: string, userId: string): Promise<ReceiptTemplate> {
    const originalTemplate = await this.findOne(id)

    const templateData = {
      name: originalTemplate.name,
      description: originalTemplate.description,
      status: originalTemplate.status,
      outletId: originalTemplate.outletId,
      createdBy: new Types.ObjectId(userId),
      version: 1,
      elements: originalTemplate.elements,
      paperConfig: originalTemplate.paperConfig,
      printerConfig: originalTemplate.printerConfig,
      isDefault: false,
      isSystem: false,
      availableVariables: originalTemplate.availableVariables,
      metadata: originalTemplate.metadata
    }
    const duplicatedTemplate = new this.receiptTemplateModel({
      ...templateData,
      name: `${originalTemplate.name} (Copy)`,
      status: TemplateStatus.DRAFT,
      isDefault: false,
      createdBy: userId,
      modifiedBy: undefined,
      version: 1,
      createdAt: undefined,
      updatedAt: undefined
    })

    return duplicatedTemplate.save()
  }

  async setAsDefault(id: string): Promise<ReceiptTemplate> {
    const template = await this.findOne(id)

    // Remove default from other templates in the same outlet
    await this.receiptTemplateModel.updateMany(
      { outletId: template.outletId, isDefault: true },
      { isDefault: false }
    )

    // Set this template as default and activate it
    const updatedTemplate = await this.receiptTemplateModel
      .findByIdAndUpdate(
        id,
        { 
          isDefault: true,
          status: TemplateStatus.ACTIVE
        },
        { new: true }
      )
      .populate('createdBy', 'firstName lastName email')
      .populate('modifiedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .exec()

    return updatedTemplate
  }

  async preview(id: string, sampleData?: any): Promise<string> {
    const template = await this.findOne(id)
    
    // Generate a preview of the receipt based on the template
    // This will be used by the frontend to show how the receipt will look
    return this.generatePreview(template, sampleData)
  }

  private generatePreview(template: ReceiptTemplate, sampleData?: any): string {
    // This method converts the template elements into a text representation
    // for preview purposes. In a real implementation, this would generate
    // ESC/POS commands or HTML/CSS for visual preview
    
    const lines: string[] = []
    const charWidth = template.paperConfig.width

    for (const element of template.elements) {
      switch (element.type) {
        case 'text':
          lines.push(this.formatText(element.content, element.alignment, charWidth))
          break
        case 'line':
          lines.push('-'.repeat(charWidth))
          break
        case 'spacer':
          for (let i = 0; i < (element.height || 1); i++) {
            lines.push('')
          }
          break
        case 'logo':
          lines.push(this.formatText('[LOGO]', element.alignment, charWidth))
          break
        case 'items_table':
          lines.push(this.formatText('--- ITEMS ---', 'center', charWidth))
          lines.push(this.formatText('1x Product Name     $10.99', 'left', charWidth))
          lines.push(this.formatText('2x Another Item     $25.98', 'left', charWidth))
          break
        case 'totals':
          lines.push(this.formatText('Subtotal:      $36.97', 'right', charWidth))
          lines.push(this.formatText('Tax:           $2.96', 'right', charWidth))
          lines.push(this.formatText('TOTAL:         $39.93', 'right', charWidth))
          break
        default:
          lines.push(this.formatText(element.content || element.type, element.alignment, charWidth))
      }

      // Add margins
      for (let i = 0; i < (element.marginBottom || 0); i++) {
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  private formatText(text: string, alignment: string, width: number): string {
    if (text.length >= width) {
      return text.substring(0, width)
    }

    switch (alignment) {
      case 'center':
        const padding = Math.floor((width - text.length) / 2)
        return ' '.repeat(padding) + text + ' '.repeat(width - text.length - padding)
      case 'right':
        return ' '.repeat(width - text.length) + text
      default: // left
        return text + ' '.repeat(width - text.length)
    }
  }
}