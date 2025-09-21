import { type Document, Types } from "mongoose";
export type SalePackInfoDocument = SalePackInfo & Document;
export declare enum SaleType {
    UNIT = "unit",
    PACK = "pack"
}
export declare class SalePackInfo {
    saleType: SaleType;
    packVariantId?: Types.ObjectId;
    packQuantity?: number;
    unitQuantity?: number;
    effectiveUnitCount: number;
}
export declare const SalePackInfoSchema: import("mongoose").Schema<SalePackInfo, import("mongoose").Model<SalePackInfo, any, any, any, Document<unknown, any, SalePackInfo> & SalePackInfo & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalePackInfo, Document<unknown, {}, import("mongoose").FlatRecord<SalePackInfo>> & import("mongoose").FlatRecord<SalePackInfo> & {
    _id: Types.ObjectId;
}>;
