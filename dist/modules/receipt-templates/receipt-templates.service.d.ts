import type { Model } from 'mongoose';
import { ReceiptTemplate, type ReceiptTemplateDocument, TemplateStatus } from '../../schemas/receipt-template.schema';
import { CreateReceiptTemplateDto } from './dto/create-receipt-template.dto';
import { UpdateReceiptTemplateDto } from './dto/update-receipt-template.dto';
export declare class ReceiptTemplatesService {
    private receiptTemplateModel;
    constructor(receiptTemplateModel: Model<ReceiptTemplateDocument>);
    create(createReceiptTemplateDto: CreateReceiptTemplateDto, userId: string): Promise<ReceiptTemplate>;
    findAll(outletId?: string, status?: TemplateStatus): Promise<ReceiptTemplate[]>;
    findOne(id: string): Promise<ReceiptTemplate>;
    findDefault(outletId: string): Promise<ReceiptTemplate>;
    update(id: string, updateReceiptTemplateDto: UpdateReceiptTemplateDto, userId: string): Promise<ReceiptTemplate>;
    remove(id: string): Promise<void>;
    duplicate(id: string, userId: string): Promise<ReceiptTemplate>;
    setAsDefault(id: string): Promise<ReceiptTemplate>;
    preview(id: string, sampleData?: any): Promise<string>;
    private generatePreview;
    private formatText;
}
