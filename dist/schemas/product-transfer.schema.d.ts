import { type Document, Types } from "mongoose";
export type ProductTransferDocument = ProductTransfer & Document;
export declare enum TransferStatus {
    PENDING = "pending",
    IN_TRANSIT = "in_transit",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class TransferItem {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    batchNumber?: string;
}
export declare class ProductTransfer {
    transferNumber: string;
    fromOutletId: Types.ObjectId;
    toOutletId: Types.ObjectId;
    items: TransferItem[];
    status: TransferStatus;
    initiatedBy: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    receivedBy?: Types.ObjectId;
    receivedAt?: Date;
    notes?: string;
}
export declare const ProductTransferSchema: import("mongoose").Schema<ProductTransfer, import("mongoose").Model<ProductTransfer, any, any, any, Document<unknown, any, ProductTransfer> & ProductTransfer & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductTransfer, Document<unknown, {}, import("mongoose").FlatRecord<ProductTransfer>> & import("mongoose").FlatRecord<ProductTransfer> & {
    _id: Types.ObjectId;
}>;
