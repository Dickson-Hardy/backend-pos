import { type Document, Types } from "mongoose";
export type PackVariantDocument = PackVariant & Document;
export declare class PackVariant {
    packSize: number;
    packPrice: number;
    unitPrice: number;
    isActive: boolean;
    name?: string;
    productId: Types.ObjectId;
}
export declare const PackVariantSchema: import("mongoose").Schema<PackVariant, import("mongoose").Model<PackVariant, any, any, any, Document<unknown, any, PackVariant> & PackVariant & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PackVariant, Document<unknown, {}, import("mongoose").FlatRecord<PackVariant>> & import("mongoose").FlatRecord<PackVariant> & {
    _id: Types.ObjectId;
}>;
