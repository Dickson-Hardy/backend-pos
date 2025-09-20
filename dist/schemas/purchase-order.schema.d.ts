import { type Document, Types } from "mongoose";
export type PurchaseOrderDocument = PurchaseOrder & Document;
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PurchaseOrderPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class PurchaseOrderItem {
    productId: Types.ObjectId;
    quantity: number;
    unitCost: number;
    totalCost: number;
    notes?: string;
}
export declare class PurchaseOrder {
    orderNumber: string;
    createdBy: Types.ObjectId;
    outletId: Types.ObjectId;
    supplierName: string;
    supplierEmail?: string;
    supplierPhone?: string;
    supplierAddress?: string;
    items: PurchaseOrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: PurchaseOrderStatus;
    priority: PurchaseOrderPriority;
    orderDate: Date;
    expectedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    notes?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
}
export declare const PurchaseOrderSchema: import("mongoose").Schema<PurchaseOrder, import("mongoose").Model<PurchaseOrder, any, any, any, Document<unknown, any, PurchaseOrder> & PurchaseOrder & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PurchaseOrder, Document<unknown, {}, import("mongoose").FlatRecord<PurchaseOrder>> & import("mongoose").FlatRecord<PurchaseOrder> & {
    _id: Types.ObjectId;
}>;
