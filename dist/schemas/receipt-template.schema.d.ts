import { type Document, Types } from "mongoose";
export type ReceiptTemplateDocument = ReceiptTemplate & Document;
export declare enum TemplateStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DRAFT = "draft"
}
export declare enum TextAlignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}
export declare enum FontSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
export declare enum FontStyle {
    NORMAL = "normal",
    BOLD = "bold",
    UNDERLINE = "underline",
    ITALIC = "italic"
}
export declare class ReceiptElement {
    type: string;
    content: string;
    alignment: TextAlignment;
    fontSize: FontSize;
    fontStyle: FontStyle;
    bold: boolean;
    underline: boolean;
    height: number;
    marginTop: number;
    marginBottom: number;
    properties: Record<string, any>;
}
export declare class PaperConfiguration {
    width: number;
    unit: string;
    physicalWidth: number;
    physicalHeight: number;
}
export declare class PrinterConfiguration {
    type: string;
    model: string;
    connectionType: string;
    commandSet: string;
    settings: Record<string, any>;
}
export declare class ReceiptTemplate {
    name: string;
    description: string;
    status: TemplateStatus;
    outletId: Types.ObjectId;
    createdBy: Types.ObjectId;
    modifiedBy: Types.ObjectId;
    version: number;
    elements: ReceiptElement[];
    paperConfig: PaperConfiguration;
    printerConfig: PrinterConfiguration;
    isDefault: boolean;
    isSystem: boolean;
    availableVariables: string[];
    metadata: Record<string, any>;
}
export declare const ReceiptTemplateSchema: import("mongoose").Schema<ReceiptTemplate, import("mongoose").Model<ReceiptTemplate, any, any, any, Document<unknown, any, ReceiptTemplate> & ReceiptTemplate & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ReceiptTemplate, Document<unknown, {}, import("mongoose").FlatRecord<ReceiptTemplate>> & import("mongoose").FlatRecord<ReceiptTemplate> & {
    _id: Types.ObjectId;
}>;
