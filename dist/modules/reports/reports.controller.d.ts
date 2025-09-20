import { ReportsService } from "./reports.service";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(outletId?: string, startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalTransactions: number;
        avgTransactionValue: number;
        salesByPeriod: any[];
        topProducts: any[];
    }>;
    getWeeklySales(outletId?: string): Promise<{
        totalRevenue: number;
        totalTransactions: number;
        avgTransactionValue: number;
        salesByPeriod: any[];
        topProducts: any[];
    }>;
    getInventoryReport(outletId?: string): Promise<{
        totalInventoryValue: number;
        totalInventoryCost: number;
        lowStockItems: (import("mongoose").Document<unknown, {}, import("../../schemas/product.schema").ProductDocument> & import("../../schemas/product.schema").Product & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        expiringBatches: (import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        expiredBatches: (import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        categoryBreakdown: any[];
    }>;
    getStaffPerformance(outletId?: string, startDate?: string, endDate?: string): Promise<any[]>;
}
