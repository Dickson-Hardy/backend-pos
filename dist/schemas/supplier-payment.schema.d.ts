import { type Document, Types } from "mongoose";
export type SupplierPaymentDocument = SupplierPayment & Document;
export declare enum PaymentStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    PAID = "paid",
    OVERDUE = "overdue"
}
export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    CHEQUE = "cheque",
    MOBILE_MONEY = "mobile_money"
}
export declare class SupplierPayment {
    paymentNumber: string;
    purchaseOrderId: Types.ObjectId;
    supplierId: Types.ObjectId;
    outletId: Types.ObjectId;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    status: PaymentStatus;
    dueDate: Date;
    paidDate?: Date;
    paymentMethod?: PaymentMethod;
    referenceNumber?: string;
    notes?: string;
    createdBy: Types.ObjectId;
    approvedBy?: Types.ObjectId;
}
export declare const SupplierPaymentSchema: import("mongoose").Schema<SupplierPayment, import("mongoose").Model<SupplierPayment, any, any, any, Document<unknown, any, SupplierPayment> & SupplierPayment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplierPayment, Document<unknown, {}, import("mongoose").FlatRecord<SupplierPayment>> & import("mongoose").FlatRecord<SupplierPayment> & {
    _id: Types.ObjectId;
}>;
