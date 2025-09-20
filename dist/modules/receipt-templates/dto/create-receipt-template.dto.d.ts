import { TemplateStatus } from '../../../schemas/receipt-template.schema';
import { CreateReceiptElementDto, CreatePaperConfigurationDto, CreatePrinterConfigurationDto } from './create-receipt-element.dto';
export declare class CreateReceiptTemplateDto {
    name: string;
    description?: string;
    status?: TemplateStatus;
    outletId: string;
    elements?: CreateReceiptElementDto[];
    paperConfig: CreatePaperConfigurationDto;
    printerConfig: CreatePrinterConfigurationDto;
    isDefault?: boolean;
    availableVariables?: string[];
    metadata?: Record<string, any>;
}
