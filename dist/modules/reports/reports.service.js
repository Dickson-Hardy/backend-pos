"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sale_schema_1 = require("../../schemas/sale.schema");
const product_schema_1 = require("../../schemas/product.schema");
const batch_schema_1 = require("../../schemas/batch.schema");
const user_schema_1 = require("../../schemas/user.schema");
let ReportsService = class ReportsService {
    constructor(saleModel, productModel, batchModel, userModel) {
        this.saleModel = saleModel;
        this.productModel = productModel;
        this.batchModel = batchModel;
        this.userModel = userModel;
    }
    async getSalesReport(outletId, startDate, endDate) {
        const sales = await this.saleModel
            .find({
            outletId,
            saleDate: { $gte: startDate, $lte: endDate },
        })
            .populate("items.productId")
            .populate("cashierId", "firstName lastName email");
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalTransactions = sales.length;
        const avgTransactionValue = totalRevenue / totalTransactions || 0;
        const salesByPeriod = this.groupSalesByPeriod(sales, "daily");
        const productSales = new Map();
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                const productId = item.productId.toString();
                if (productSales.has(productId)) {
                    const existing = productSales.get(productId);
                    existing.quantity += item.quantity;
                    existing.revenue += item.totalPrice;
                }
                else {
                    productSales.set(productId, {
                        productId: item.productId,
                        quantity: item.quantity,
                        revenue: item.totalPrice,
                    });
                }
            });
        });
        const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        return {
            totalRevenue,
            totalTransactions,
            avgTransactionValue,
            salesByPeriod,
            topProducts,
        };
    }
    async getInventoryReport(outletId) {
        const products = await this.productModel.find({ outletId });
        const batches = await this.batchModel.find({ outletId });
        const totalInventoryValue = products.reduce((sum, product) => sum + product.sellingPrice * product.stockQuantity, 0);
        const totalInventoryCost = products.reduce((sum, product) => sum + product.costPrice * product.stockQuantity, 0);
        const lowStockItems = products.filter((product) => product.stockQuantity < product.reorderLevel);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        const expiringBatches = batches.filter((batch) => new Date(batch.expiryDate) < sixMonthsFromNow && new Date(batch.expiryDate) > new Date());
        const expiredBatches = batches.filter((batch) => new Date(batch.expiryDate) < new Date());
        const categoryBreakdown = new Map();
        products.forEach((product) => {
            const category = product.category;
            if (categoryBreakdown.has(category)) {
                const existing = categoryBreakdown.get(category);
                existing.value += product.sellingPrice * product.stockQuantity;
                existing.cost += product.costPrice * product.stockQuantity;
                existing.count += 1;
            }
            else {
                categoryBreakdown.set(category, {
                    category,
                    value: product.sellingPrice * product.stockQuantity,
                    cost: product.costPrice * product.stockQuantity,
                    count: 1,
                });
            }
        });
        return {
            totalInventoryValue,
            totalInventoryCost,
            lowStockItems,
            expiringBatches,
            expiredBatches,
            categoryBreakdown: Array.from(categoryBreakdown.values()),
        };
    }
    async getStaffPerformance(outletId, startDate, endDate) {
        const sales = await this.saleModel
            .find({
            outletId,
            saleDate: { $gte: startDate, $lte: endDate },
        })
            .populate("cashierId", "firstName lastName email role");
        const staffPerformance = new Map();
        sales.forEach((sale) => {
            const cashierId = sale.cashierId._id.toString();
            if (staffPerformance.has(cashierId)) {
                const existing = staffPerformance.get(cashierId);
                existing.sales += sale.total;
                existing.transactions += 1;
            }
            else {
                staffPerformance.set(cashierId, {
                    cashier: sale.cashierId,
                    sales: sale.total,
                    transactions: 1,
                });
            }
        });
        return Array.from(staffPerformance.values())
            .map((staff) => ({
            ...staff,
            avgTransactionValue: staff.sales / staff.transactions,
        }))
            .sort((a, b) => b.sales - a.sales);
    }
    groupSalesByPeriod(sales, period) {
        const grouped = new Map();
        sales.forEach((sale) => {
            let key;
            const date = new Date(sale.saleDate);
            switch (period) {
                case "daily":
                    key = date.toISOString().split("T")[0];
                    break;
                case "weekly":
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split("T")[0];
                    break;
                case "monthly":
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                    break;
            }
            if (grouped.has(key)) {
                const existing = grouped.get(key);
                existing.revenue += sale.total;
                existing.transactions += 1;
            }
            else {
                grouped.set(key, {
                    period: key,
                    revenue: sale.total,
                    transactions: 1,
                });
            }
        });
        return Array.from(grouped.values()).sort((a, b) => a.period.localeCompare(b.period));
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(batch_schema_1.Batch.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Function, Function, Function, Function])
], ReportsService);
//# sourceMappingURL=reports.service.js.map