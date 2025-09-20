import { type Document, Types } from "mongoose";
export type BatchDocument = Batch & Document;
export declare enum BatchStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    RECALLED = "recalled",
    SOLD_OUT = "sold_out"
}
export declare class Batch {
    batchNumber: string;
    productId: Types.ObjectId;
    outletId: Types.ObjectId;
    manufacturingDate: Date;
    expiryDate: Date;
    quantity: number;
    soldQuantity: number;
    costPrice: number;
    sellingPrice: number;
    status: BatchStatus;
    supplierName: string;
    supplierInvoice: string;
    notes: string;
}
export declare const BatchSchema: import("mongoose").Schema<Batch, import("mongoose").Model<Batch, any, any, any, Document<unknown, any, Batch> & Batch & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Batch, Document<unknown, {}, import("mongoose").FlatRecord<Batch>> & import("mongoose").FlatRecord<Batch> & {
    _id: Types.ObjectId;
}>;
