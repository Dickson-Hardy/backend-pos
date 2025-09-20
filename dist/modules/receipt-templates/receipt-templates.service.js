"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const receipt_template_schema_1 = require("../../schemas/receipt-template.schema");
let ReceiptTemplatesService = class ReceiptTemplatesService {
    constructor(receiptTemplateModel) {
        this.receiptTemplateModel = receiptTemplateModel;
    }
    async create(createReceiptTemplateDto, userId) {
        if (createReceiptTemplateDto.isDefault) {
            await this.receiptTemplateModel.updateMany({ outletId: createReceiptTemplateDto.outletId, isDefault: true }, { isDefault: false });
        }
        const template = new this.receiptTemplateModel({
            ...createReceiptTemplateDto,
            createdBy: userId,
            version: 1
        });
        return template.save();
    }
    async findAll(outletId, status) {
        const filter = {};
        if (outletId) {
            filter.outletId = outletId;
        }
        if (status) {
            filter.status = status;
        }
        return this.receiptTemplateModel
            .find(filter)
            .populate('createdBy', 'firstName lastName email')
            .populate('modifiedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const template = await this.receiptTemplateModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('modifiedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .exec();
        if (!template) {
            throw new common_1.NotFoundException(`Receipt template with ID ${id} not found`);
        }
        return template;
    }
    async findDefault(outletId) {
        const template = await this.receiptTemplateModel
            .findOne({ outletId, isDefault: true, status: receipt_template_schema_1.TemplateStatus.ACTIVE })
            .populate('createdBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .exec();
        if (!template) {
            throw new common_1.NotFoundException(`No default receipt template found for outlet ${outletId}`);
        }
        return template;
    }
    async update(id, updateReceiptTemplateDto, userId) {
        const existingTemplate = await this.findOne(id);
        if (existingTemplate.isSystem) {
            throw new common_1.BadRequestException('System templates cannot be modified');
        }
        if (updateReceiptTemplateDto.isDefault) {
            await this.receiptTemplateModel.updateMany({ outletId: existingTemplate.outletId, isDefault: true, _id: { $ne: id } }, { isDefault: false });
        }
        let versionIncrement = 0;
        if (updateReceiptTemplateDto.elements && updateReceiptTemplateDto.elements.length > 0) {
            versionIncrement = 1;
        }
        const updatedTemplate = await this.receiptTemplateModel
            .findByIdAndUpdate(id, {
            ...updateReceiptTemplateDto,
            modifiedBy: userId,
            $inc: { version: versionIncrement }
        }, { new: true })
            .populate('createdBy', 'firstName lastName email')
            .populate('modifiedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .exec();
        return updatedTemplate;
    }
    async remove(id) {
        const template = await this.findOne(id);
        if (template.isSystem) {
            throw new common_1.BadRequestException('System templates cannot be deleted');
        }
        if (template.isDefault && template.status === receipt_template_schema_1.TemplateStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot delete active default template. Set another template as default first.');
        }
        await this.receiptTemplateModel.findByIdAndDelete(id);
    }
    async duplicate(id, userId) {
        const originalTemplate = await this.findOne(id);
        const templateData = {
            name: originalTemplate.name,
            description: originalTemplate.description,
            status: originalTemplate.status,
            outletId: originalTemplate.outletId,
            createdBy: new mongoose_2.Types.ObjectId(userId),
            version: 1,
            elements: originalTemplate.elements,
            paperConfig: originalTemplate.paperConfig,
            printerConfig: originalTemplate.printerConfig,
            isDefault: false,
            isSystem: false,
            availableVariables: originalTemplate.availableVariables,
            metadata: originalTemplate.metadata
        };
        const duplicatedTemplate = new this.receiptTemplateModel({
            ...templateData,
            name: `${originalTemplate.name} (Copy)`,
            status: receipt_template_schema_1.TemplateStatus.DRAFT,
            isDefault: false,
            createdBy: userId,
            modifiedBy: undefined,
            version: 1,
            createdAt: undefined,
            updatedAt: undefined
        });
        return duplicatedTemplate.save();
    }
    async setAsDefault(id) {
        const template = await this.findOne(id);
        await this.receiptTemplateModel.updateMany({ outletId: template.outletId, isDefault: true }, { isDefault: false });
        const updatedTemplate = await this.receiptTemplateModel
            .findByIdAndUpdate(id, {
            isDefault: true,
            status: receipt_template_schema_1.TemplateStatus.ACTIVE
        }, { new: true })
            .populate('createdBy', 'firstName lastName email')
            .populate('modifiedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .exec();
        return updatedTemplate;
    }
    async preview(id, sampleData) {
        const template = await this.findOne(id);
        return this.generatePreview(template, sampleData);
    }
    generatePreview(template, sampleData) {
        const lines = [];
        const charWidth = template.paperConfig.width;
        for (const element of template.elements) {
            switch (element.type) {
                case 'text':
                    lines.push(this.formatText(element.content, element.alignment, charWidth));
                    break;
                case 'line':
                    lines.push('-'.repeat(charWidth));
                    break;
                case 'spacer':
                    for (let i = 0; i < (element.height || 1); i++) {
                        lines.push('');
                    }
                    break;
                case 'logo':
                    lines.push(this.formatText('[LOGO]', element.alignment, charWidth));
                    break;
                case 'items_table':
                    lines.push(this.formatText('--- ITEMS ---', 'center', charWidth));
                    lines.push(this.formatText('1x Product Name     $10.99', 'left', charWidth));
                    lines.push(this.formatText('2x Another Item     $25.98', 'left', charWidth));
                    break;
                case 'totals':
                    lines.push(this.formatText('Subtotal:      $36.97', 'right', charWidth));
                    lines.push(this.formatText('Tax:           $2.96', 'right', charWidth));
                    lines.push(this.formatText('TOTAL:         $39.93', 'right', charWidth));
                    break;
                default:
                    lines.push(this.formatText(element.content || element.type, element.alignment, charWidth));
            }
            for (let i = 0; i < (element.marginBottom || 0); i++) {
                lines.push('');
            }
        }
        return lines.join('\n');
    }
    formatText(text, alignment, width) {
        if (text.length >= width) {
            return text.substring(0, width);
        }
        switch (alignment) {
            case 'center':
                const padding = Math.floor((width - text.length) / 2);
                return ' '.repeat(padding) + text + ' '.repeat(width - text.length - padding);
            case 'right':
                return ' '.repeat(width - text.length) + text;
            default:
                return text + ' '.repeat(width - text.length);
        }
    }
};
exports.ReceiptTemplatesService = ReceiptTemplatesService;
exports.ReceiptTemplatesService = ReceiptTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(receipt_template_schema_1.ReceiptTemplate.name)),
    __metadata("design:paramtypes", [Function])
], ReceiptTemplatesService);
//# sourceMappingURL=receipt-templates.service.js.map