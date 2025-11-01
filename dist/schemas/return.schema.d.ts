import { type Document, Types } from "mongoose";
export type ReturnDocument = Return & Document;
export declare enum ReturnReason {
    EXPIRED = "expired",
    DAMAGED = "damaged",
    WRONG_ITEM = "wrong_item",
    CUSTOMER_REQUEST = "customer_request",
    DEFECTIVE = "defective",
    OTHER = "other"
}
export declare enum ReturnStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed"
}
export declare enum RefundMethod {
    CASH = "cash",
    CARD_REVERSAL = "card_reversal",
    STORE_CREDIT = "store_credit",
    EXCHANGE = "exchange"
}
export declare class ReturnItem {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalRefund: number;
    reason: ReturnReason;
    batchNumber?: string;
}
export declare class Return {
    returnNumber: string;
    originalSaleId: Types.ObjectId;
    originalReceiptNumber: string;
    outletId: Types.ObjectId;
    processedBy: Types.ObjectId;
    items: ReturnItem[];
    totalRefundAmount: number;
    status: ReturnStatus;
    refundMethod: RefundMethod;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    restockedToInventory: boolean;
}
export declare const ReturnSchema: import("mongoose").Schema<Return, import("mongoose").Model<Return, any, any, any, Document<unknown, any, Return> & Return & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Return, Document<unknown, {}, import("mongoose").FlatRecord<Return>> & import("mongoose").FlatRecord<Return> & {
    _id: Types.ObjectId;
}>;
