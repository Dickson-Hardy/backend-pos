import { Document, Types } from 'mongoose';
export type ShiftDocument = Shift & Document;
export declare class Shift {
    cashierId: Types.ObjectId;
    outletId: Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    openingBalance: number;
    closingBalance?: number;
    totalSales: number;
    totalExpenses: number;
    netAmount: number;
    status: 'active' | 'closed';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ShiftSchema: import("mongoose").Schema<Shift, import("mongoose").Model<Shift, any, any, any, Document<unknown, any, Shift> & Shift & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shift, Document<unknown, {}, import("mongoose").FlatRecord<Shift>> & import("mongoose").FlatRecord<Shift> & {
    _id: Types.ObjectId;
}>;
