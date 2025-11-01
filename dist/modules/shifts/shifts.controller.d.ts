import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { EndShiftDto } from './dto/end-shift.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    createShift(createShiftDto: CreateShiftDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getStats(): Promise<{
        activeShifts: number;
        totalShiftsToday: number;
        averageShiftDuration: number;
    }>;
    getCurrentShift(req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getDailyShifts(date: string, req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
    getDailySummary(date: string, req: any): Promise<{
        shifts: {
            id: any;
            cashierId: import("mongoose").Types.ObjectId;
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
    getShiftById(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getShiftReport(id: string, req: any): Promise<{
        shift: import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
        expenses: (import("mongoose").Document<unknown, {}, import("../../schemas/expense.schema").ExpenseDocument> & import("../../schemas/expense.schema").Expense & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
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
    endShift(id: string, endShiftDto: EndShiftDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/shift.schema").ShiftDocument> & import("../../schemas/shift.schema").Shift & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addExpense(id: string, createExpenseDto: CreateExpenseDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/expense.schema").ExpenseDocument> & import("../../schemas/expense.schema").Expense & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getShiftExpenses(id: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/expense.schema").ExpenseDocument> & import("../../schemas/expense.schema").Expense & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
