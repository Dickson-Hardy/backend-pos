import { type Document, Types } from "mongoose";
export type SaleDocument = Sale & Document;
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    MOBILE = "mobile",
    INSURANCE = "insurance"
}
export declare enum SaleStatus {
    COMPLETED = "completed",
    PENDING = "pending",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class SaleItem {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    batchNumber: string;
    discount: number;
}
export declare class Sale {
    receiptNumber: string;
    outletId: Types.ObjectId;
    cashierId: Types.ObjectId;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    customerName: string;
    customerPhone: string;
    prescriptionNumber: string;
    doctorName: string;
    notes: string;
    saleDate: Date;
}
export declare const SaleSchema: import("mongoose").Schema<Sale, import("mongoose").Model<Sale, any, any, any, Document<unknown, any, Sale> & Sale & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, import("mongoose").FlatRecord<Sale>> & import("mongoose").FlatRecord<Sale> & {
    _id: Types.ObjectId;
}>;
