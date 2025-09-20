import type { Model } from "mongoose";
import { type SaleDocument } from "../../schemas/sale.schema";
import { Product, type ProductDocument } from "../../schemas/product.schema";
import { Batch, type BatchDocument } from "../../schemas/batch.schema";
import { type UserDocument } from "../../schemas/user.schema";
export declare class ReportsService {
    private saleModel;
    private productModel;
    private batchModel;
    private userModel;
    constructor(saleModel: Model<SaleDocument>, productModel: Model<ProductDocument>, batchModel: Model<BatchDocument>, userModel: Model<UserDocument>);
    getSalesReport(outletId: string, startDate: Date, endDate: Date): Promise<{
        totalRevenue: number;
        totalTransactions: number;
        avgTransactionValue: number;
        salesByPeriod: any[];
        topProducts: any[];
    }>;
    getInventoryReport(outletId: string): Promise<{
        totalInventoryValue: number;
        totalInventoryCost: number;
        lowStockItems: (import("mongoose").Document<unknown, {}, ProductDocument> & Product & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        expiringBatches: (import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        expiredBatches: (import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        categoryBreakdown: any[];
    }>;
    getStaffPerformance(outletId: string, startDate: Date, endDate: Date): Promise<any[]>;
    private groupSalesByPeriod;
}
