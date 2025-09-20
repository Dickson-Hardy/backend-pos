import { type Document, Types } from "mongoose";
export type OutletDocument = Outlet & Document;
export declare enum OutletStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    MAINTENANCE = "maintenance"
}
export declare class Outlet {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    licenseNumber: string;
    managerId: Types.ObjectId;
    status: OutletStatus;
    totalSales: number;
    totalTransactions: number;
    operatingHours: {
        open: string;
        close: string;
        days: string[];
    };
}
export declare const OutletSchema: import("mongoose").Schema<Outlet, import("mongoose").Model<Outlet, any, any, any, Document<unknown, any, Outlet> & Outlet & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Outlet, Document<unknown, {}, import("mongoose").FlatRecord<Outlet>> & import("mongoose").FlatRecord<Outlet> & {
    _id: Types.ObjectId;
}>;
