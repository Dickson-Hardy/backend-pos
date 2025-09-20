import { CreateReceiptTemplateDto } from './create-receipt-template.dto';
import { CreateReceiptElementDto } from './create-receipt-element.dto';
declare const UpdateReceiptTemplateDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateReceiptTemplateDto>>;
export declare class UpdateReceiptTemplateDto extends UpdateReceiptTemplateDto_base {
    modifiedBy?: string;
    isDefault?: boolean;
    elements?: CreateReceiptElementDto[];
}
export {};
