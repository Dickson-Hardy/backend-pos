import { TextAlignment, FontSize, FontStyle } from '../../../schemas/receipt-template.schema';
export declare class CreateReceiptElementDto {
    type: string;
    content: string;
    alignment?: TextAlignment;
    fontSize?: FontSize;
    fontStyle?: FontStyle;
    bold?: boolean;
    underline?: boolean;
    height?: number;
    marginTop?: number;
    marginBottom?: number;
    properties?: Record<string, any>;
}
export declare class CreatePaperConfigurationDto {
    width: number;
    unit?: string;
    physicalWidth?: number;
    physicalHeight?: number;
}
export declare class CreatePrinterConfigurationDto {
    type: string;
    model: string;
    connectionType: string;
    commandSet?: string;
    settings?: Record<string, any>;
}
