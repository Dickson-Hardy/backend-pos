import { Model, Types } from 'mongoose';
import { Shift, ShiftDocument } from '../../schemas/shift.schema';
import { Expense, ExpenseDocument } from '../../schemas/expense.schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { EndShiftDto } from './dto/end-shift.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ShiftsService {
    private shiftModel;
    private expenseModel;
    constructor(shiftModel: Model<ShiftDocument>, expenseModel: Model<ExpenseDocument>);
    createShift(createShiftDto: CreateShiftDto, cashierId: string, outletId: string): Promise<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    endShift(shiftId: string, endShiftDto: EndShiftDto, cashierId: string): Promise<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getCurrentShift(cashierId: string): Promise<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getShiftById(shiftId: string, cashierId: string): Promise<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getDailyShifts(outletId: string, date: string): Promise<Omit<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
    getShiftReport(shiftId: string, cashierId: string): Promise<{
        shift: import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        };
        expenses: (import("mongoose").Document<unknown, {}, ExpenseDocument> & Expense & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        })[];
        summary: {
            totalSales: number;
            totalExpenses: number;
            netAmount: number;
            openingBalance: number;
            closingBalance: number;
            duration: number;
        };
    }>;
    addExpense(shiftId: string, createExpenseDto: CreateExpenseDto, cashierId: string): Promise<import("mongoose").Document<unknown, {}, ExpenseDocument> & Expense & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getShiftExpenses(shiftId: string, cashierId: string): Promise<(import("mongoose").Document<unknown, {}, ExpenseDocument> & Expense & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
    updateShiftSales(shiftId: string, saleAmount: number): Promise<import("mongoose").Document<unknown, {}, ShiftDocument> & Shift & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getDailySummary(outletId: string, date: string): Promise<{
        shifts: {
            id: any;
            cashierId: Types.ObjectId;
            startTime: Date;
            endTime: Date;
            status: "active" | "closed";
            totalSales: number;
            totalExpenses: number;
            netAmount: number;
        }[];
        totalSales: number;
        totalExpenses: number;
        netAmount: number;
        shiftCount: number;
        date: string;
    }>;
    getStats(): Promise<{
        activeShifts: number;
        totalShiftsToday: number;
        averageShiftDuration: number;
    }>;
}
