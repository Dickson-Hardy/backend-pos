import { type Document, Types } from "mongoose";
export type SupplierDocument = Supplier & Document;
export declare enum SupplierStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class Supplier {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    status: SupplierStatus;
    rating: number;
    productsSupplied: number;
    lastOrder?: Date;
    paymentTerms: string;
    website?: string;
    taxId?: string;
    bankDetails?: string;
    notes?: string;
    categories: string[];
    outletId: Types.ObjectId;
}
export declare const SupplierSchema: import("mongoose").Schema<Supplier, import("mongoose").Model<Supplier, any, any, any, Document<unknown, any, Supplier> & Supplier & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Supplier, Document<unknown, {}, import("mongoose").FlatRecord<Supplier>> & import("mongoose").FlatRecord<Supplier> & {
    _id: Types.ObjectId;
}>;
