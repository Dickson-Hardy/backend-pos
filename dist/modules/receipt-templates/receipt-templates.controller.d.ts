import { ReceiptTemplatesService } from './receipt-templates.service';
import { CreateReceiptTemplateDto } from './dto/create-receipt-template.dto';
import { UpdateReceiptTemplateDto } from './dto/update-receipt-template.dto';
import { TemplateStatus } from '../../schemas/receipt-template.schema';
export declare class ReceiptTemplatesController {
    private readonly receiptTemplatesService;
    constructor(receiptTemplatesService: ReceiptTemplatesService);
    create(createReceiptTemplateDto: CreateReceiptTemplateDto, req: any): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    findAll(outletId?: string, status?: TemplateStatus): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate[]>;
    findDefault(outletId: string): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    findOne(id: string): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    preview(id: string, sampleData?: any): Promise<string>;
    update(id: string, updateReceiptTemplateDto: UpdateReceiptTemplateDto, req: any): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    duplicate(id: string, req: any): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    setAsDefault(id: string): Promise<import("../../schemas/receipt-template.schema").ReceiptTemplate>;
    remove(id: string): Promise<void>;
}
