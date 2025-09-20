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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reconciliation_schema_1 = require("../../schemas/reconciliation.schema");
const sale_schema_1 = require("../../schemas/sale.schema");
const product_schema_1 = require("../../schemas/product.schema");
let ReconciliationService = class ReconciliationService {
    constructor(reconciliationModel, saleModel, productModel) {
        this.reconciliationModel = reconciliationModel;
        this.saleModel = saleModel;
        this.productModel = productModel;
    }
    async startDailyCashReconciliation(data) {
        const dateStart = new Date(data.reconciliationDate);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(data.reconciliationDate);
        dateEnd.setHours(23, 59, 59, 999);
        const salesData = await this.calculateDailySalesData(data.outletId, dateStart, dateEnd);
        const expectedCash = data.startingCash + salesData.cashSales - salesData.cashRefunds - salesData.cashPayouts;
        const reconciliation = new this.reconciliationModel({
            type: reconciliation_schema_1.ReconciliationType.DAILY_CASH,
            status: reconciliation_schema_1.ReconciliationStatus.IN_PROGRESS,
            outletId: data.outletId,
            performedBy: data.performedBy,
            reconciliationDate: data.reconciliationDate,
            periodStart: dateStart,
            periodEnd: dateEnd,
            cashData: {
                startingCash: data.startingCash,
                expectedCash,
                cashSales: salesData.cashSales,
                cashRefunds: salesData.cashRefunds,
                cashPayouts: salesData.cashPayouts,
                actualCashCount: {
                    hundreds: 0,
                    fifties: 0,
                    twenties: 0,
                    tens: 0,
                    fives: 0,
                    ones: 0,
                    quarters: 0,
                    dimes: 0,
                    nickels: 0,
                    pennies: 0,
                    totalCounted: 0
                },
                actualCashTotal: 0,
                variance: 0
            }
        });
        return reconciliation.save();
    }
    async submitCashCount(reconciliationId, cashCount, performedBy) {
        const reconciliation = await this.reconciliationModel.findById(reconciliationId);
        if (!reconciliation) {
            throw new common_1.NotFoundException('Reconciliation not found');
        }
        const totalCounted = (cashCount.hundreds * 100) +
            (cashCount.fifties * 50) +
            (cashCount.twenties * 20) +
            (cashCount.tens * 10) +
            (cashCount.fives * 5) +
            (cashCount.ones * 1) +
            (cashCount.quarters * 0.25) +
            (cashCount.dimes * 0.10) +
            (cashCount.nickels * 0.05) +
            (cashCount.pennies * 0.01);
        const variance = reconciliation.cashData.expectedCash - totalCounted;
        reconciliation.cashData.actualCashCount = {
            ...cashCount,
            totalCounted
        };
        reconciliation.cashData.actualCashTotal = totalCounted;
        reconciliation.cashData.variance = variance;
        reconciliation.totalVariance = Math.abs(variance);
        reconciliation.hasSignificantVariance = Math.abs(variance) > 10;
        reconciliation.status = reconciliation_schema_1.ReconciliationStatus.COMPLETED;
        reconciliation.auditTrail.push({
            action: 'cash_count_submitted',
            performedBy: new mongoose_2.Types.ObjectId(performedBy),
            timestamp: new Date(),
            details: `Cash count submitted. Variance: $${variance.toFixed(2)}`
        });
        return reconciliation.save();
    }
    async createShiftReconciliation(data) {
        const salesData = await this.calculateDailySalesData(data.outletId, data.shiftStart, data.shiftEnd);
        const reconciliation = new this.reconciliationModel({
            type: reconciliation_schema_1.ReconciliationType.SHIFT_RECONCILIATION,
            status: reconciliation_schema_1.ReconciliationStatus.IN_PROGRESS,
            outletId: data.outletId,
            performedBy: data.performedBy,
            reconciliationDate: new Date(),
            periodStart: data.shiftStart,
            periodEnd: data.shiftEnd,
            cashData: {
                startingCash: data.startingCash,
                expectedCash: data.startingCash + salesData.cashSales - salesData.cashRefunds,
                cashSales: salesData.cashSales,
                cashRefunds: salesData.cashRefunds,
                cashPayouts: salesData.cashPayouts,
                actualCashCount: {
                    hundreds: 0, fifties: 0, twenties: 0, tens: 0, fives: 0,
                    ones: 0, quarters: 0, dimes: 0, nickels: 0, pennies: 0, totalCounted: 0
                },
                actualCashTotal: 0,
                variance: 0
            },
            paymentData: await this.calculatePaymentTotals(data.outletId, data.shiftStart, data.shiftEnd)
        });
        return reconciliation.save();
    }
    async createBankReconciliation(data) {
        const reconciliation = new this.reconciliationModel({
            type: reconciliation_schema_1.ReconciliationType.BANK_RECONCILIATION,
            status: reconciliation_schema_1.ReconciliationStatus.IN_PROGRESS,
            outletId: data.outletId,
            performedBy: data.performedBy,
            reconciliationDate: new Date(),
            bankData: {
                statementDate: data.statementDate,
                statementBalance: data.statementBalance,
                bookBalance: data.bookBalance,
                reconciledBalance: 0,
                variance: data.statementBalance - data.bookBalance,
                outstandingDeposits: [],
                outstandingWithdrawals: [],
                bankAdjustments: []
            }
        });
        return reconciliation.save();
    }
    async addBankReconciliationItem(reconciliationId, item) {
        const reconciliation = await this.reconciliationModel.findById(reconciliationId);
        if (!reconciliation || reconciliation.type !== reconciliation_schema_1.ReconciliationType.BANK_RECONCILIATION) {
            throw new common_1.NotFoundException('Bank reconciliation not found');
        }
        switch (item.type) {
            case 'deposit':
                reconciliation.bankData.outstandingDeposits.push({
                    date: item.date,
                    amount: item.amount,
                    reference: item.reference,
                    description: item.description
                });
                break;
            case 'withdrawal':
                reconciliation.bankData.outstandingWithdrawals.push({
                    date: item.date,
                    amount: item.amount,
                    reference: item.reference,
                    description: item.description
                });
                break;
            case 'adjustment':
                reconciliation.bankData.bankAdjustments.push({
                    date: item.date,
                    amount: item.amount,
                    type: item.adjustmentType,
                    description: item.description
                });
                break;
        }
        const outstandingDepositsTotal = reconciliation.bankData.outstandingDeposits
            .reduce((sum, dep) => sum + dep.amount, 0);
        const outstandingWithdrawalsTotal = reconciliation.bankData.outstandingWithdrawals
            .reduce((sum, wd) => sum + wd.amount, 0);
        const adjustmentsTotal = reconciliation.bankData.bankAdjustments
            .reduce((sum, adj) => sum + adj.amount, 0);
        reconciliation.bankData.reconciledBalance =
            reconciliation.bankData.bookBalance +
                outstandingDepositsTotal -
                outstandingWithdrawalsTotal +
                adjustmentsTotal;
        reconciliation.bankData.variance =
            reconciliation.bankData.statementBalance - reconciliation.bankData.reconciledBalance;
        return reconciliation.save();
    }
    async createInventoryReconciliation(data) {
        const products = await this.productModel.find({
            _id: { $in: data.productIds },
            outletId: data.outletId
        });
        const inventoryItems = products.map(product => ({
            productId: product._id,
            productName: product.name,
            expectedQuantity: product.stockQuantity || 0,
            countedQuantity: 0,
            variance: 0,
            unitCost: product.costPrice || 0,
            varianceValue: 0,
            batchNumber: '',
            location: ''
        }));
        const reconciliation = new this.reconciliationModel({
            type: reconciliation_schema_1.ReconciliationType.INVENTORY_COUNT,
            status: reconciliation_schema_1.ReconciliationStatus.IN_PROGRESS,
            outletId: data.outletId,
            performedBy: data.performedBy,
            reconciliationDate: new Date(),
            inventoryItems
        });
        return reconciliation.save();
    }
    async updateInventoryCount(reconciliationId, updates) {
        const reconciliation = await this.reconciliationModel.findById(reconciliationId);
        if (!reconciliation || reconciliation.type !== reconciliation_schema_1.ReconciliationType.INVENTORY_COUNT) {
            throw new common_1.NotFoundException('Inventory reconciliation not found');
        }
        updates.forEach(update => {
            const item = reconciliation.inventoryItems.find(item => item.productId.toString() === update.productId);
            if (item) {
                item.countedQuantity = update.countedQuantity;
                item.variance = item.expectedQuantity - update.countedQuantity;
                item.varianceValue = item.variance * item.unitCost;
                item.batchNumber = update.batchNumber || item.batchNumber;
                item.location = update.location || item.location;
                item.reason = update.reason || item.reason;
            }
        });
        reconciliation.totalVariance = reconciliation.inventoryItems
            .reduce((sum, item) => sum + Math.abs(item.varianceValue), 0);
        reconciliation.hasSignificantVariance = reconciliation.totalVariance > 100;
        return reconciliation.save();
    }
    async findAll(filters) {
        const query = {};
        if (filters.outletId)
            query.outletId = filters.outletId;
        if (filters.type)
            query.type = filters.type;
        if (filters.status)
            query.status = filters.status;
        if (filters.startDate || filters.endDate) {
            query.reconciliationDate = {};
            if (filters.startDate)
                query.reconciliationDate.$gte = filters.startDate;
            if (filters.endDate)
                query.reconciliationDate.$lte = filters.endDate;
        }
        return this.reconciliationModel
            .find(query)
            .populate('performedBy', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .sort({ reconciliationDate: -1 })
            .exec();
    }
    async findOne(id) {
        const reconciliation = await this.reconciliationModel
            .findById(id)
            .populate('performedBy', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .populate('outletId', 'name address')
            .exec();
        if (!reconciliation) {
            throw new common_1.NotFoundException('Reconciliation not found');
        }
        return reconciliation;
    }
    async approveReconciliation(id, approvedBy, notes) {
        const reconciliation = await this.reconciliationModel.findById(id);
        if (!reconciliation) {
            throw new common_1.NotFoundException('Reconciliation not found');
        }
        if (reconciliation.status !== reconciliation_schema_1.ReconciliationStatus.COMPLETED) {
            throw new common_1.BadRequestException('Reconciliation must be completed before approval');
        }
        reconciliation.status = reconciliation_schema_1.ReconciliationStatus.APPROVED;
        reconciliation.approvedBy = new mongoose_2.Types.ObjectId(approvedBy);
        reconciliation.approvedAt = new Date();
        if (notes)
            reconciliation.managerNotes = notes;
        reconciliation.auditTrail.push({
            action: 'approved',
            performedBy: new mongoose_2.Types.ObjectId(approvedBy),
            timestamp: new Date(),
            details: `Reconciliation approved${notes ? `: ${notes}` : ''}`
        });
        return reconciliation.save();
    }
    async getReconciliationSummary(outletId, startDate, endDate) {
        const reconciliations = await this.reconciliationModel
            .find({
            outletId,
            reconciliationDate: { $gte: startDate, $lte: endDate }
        })
            .exec();
        const summary = {
            totalReconciliations: reconciliations.length,
            byType: {},
            byStatus: {},
            totalVariance: 0,
            significantVariances: 0,
            avgVariance: 0
        };
        reconciliations.forEach(recon => {
            summary.byType[recon.type] = (summary.byType[recon.type] || 0) + 1;
            summary.byStatus[recon.status] = (summary.byStatus[recon.status] || 0) + 1;
            if (recon.totalVariance) {
                summary.totalVariance += recon.totalVariance;
            }
            if (recon.hasSignificantVariance) {
                summary.significantVariances++;
            }
        });
        summary.avgVariance = summary.totalVariance / reconciliations.length || 0;
        return summary;
    }
    async calculateDailySalesData(outletId, startDate, endDate) {
        const sales = await this.saleModel
            .find({
            outletId,
            createdAt: { $gte: startDate, $lte: endDate }
        })
            .exec();
        let cashSales = 0;
        let cashRefunds = 0;
        let cashPayouts = 0;
        sales.forEach(sale => {
            if (sale.paymentMethod === 'cash') {
                if (sale.total > 0) {
                    cashSales += sale.total;
                }
                else {
                    cashRefunds += Math.abs(sale.total);
                }
            }
        });
        return { cashSales, cashRefunds, cashPayouts };
    }
    async calculatePaymentTotals(outletId, startDate, endDate) {
        const sales = await this.saleModel
            .find({
            outletId,
            createdAt: { $gte: startDate, $lte: endDate }
        })
            .exec();
        const totals = {
            cash: 0,
            creditCard: 0,
            debitCard: 0,
            check: 0,
            giftCard: 0,
            insurance: 0,
            other: 0
        };
        sales.forEach(sale => {
            const method = sale.paymentMethod;
            const amount = sale.total;
            switch (method) {
                case sale_schema_1.PaymentMethod.CASH:
                    totals.cash += amount;
                    break;
                case sale_schema_1.PaymentMethod.CARD:
                    totals.creditCard += amount;
                    break;
                case sale_schema_1.PaymentMethod.MOBILE:
                    totals.debitCard += amount;
                    break;
                case sale_schema_1.PaymentMethod.INSURANCE:
                    totals.insurance += amount;
                    break;
                default:
                    totals.other += amount;
                    break;
            }
        });
        return {
            expectedTotals: totals,
            actualTotals: { ...totals },
            variances: {
                cash: 0,
                creditCard: 0,
                debitCard: 0,
                check: 0,
                giftCard: 0,
                insurance: 0,
                other: 0
            },
            creditCardBatches: []
        };
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reconciliation_schema_1.Reconciliation.name)),
    __param(1, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [Function, Function, Function])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map