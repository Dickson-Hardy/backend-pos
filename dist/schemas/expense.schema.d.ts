import { Document, Types } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare class Expense {
    shiftId: Types.ObjectId;
    amount: number;
    description: string;
    category: 'operational' | 'maintenance' | 'supplies' | 'other';
    addedBy?: Types.ObjectId;
    receiptNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense> & Expense & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>> & import("mongoose").FlatRecord<Expense> & {
    _id: Types.ObjectId;
}>;
