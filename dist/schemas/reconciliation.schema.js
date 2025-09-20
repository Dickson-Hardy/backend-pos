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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationSchema = exports.Reconciliation = exports.PaymentReconciliationData = exports.InventoryReconciliationItem = exports.BankReconciliationData = exports.DailyCashData = exports.CashBreakdown = exports.ReconciliationStatus = exports.ReconciliationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReconciliationType;
(function (ReconciliationType) {
    ReconciliationType["DAILY_CASH"] = "daily_cash";
    ReconciliationType["SHIFT_RECONCILIATION"] = "shift_reconciliation";
    ReconciliationType["BANK_RECONCILIATION"] = "bank_reconciliation";
    ReconciliationType["INVENTORY_COUNT"] = "inventory_count";
    ReconciliationType["PAYMENT_RECONCILIATION"] = "payment_reconciliation";
})(ReconciliationType || (exports.ReconciliationType = ReconciliationType = {}));
var ReconciliationStatus;
(function (ReconciliationStatus) {
    ReconciliationStatus["PENDING"] = "pending";
    ReconciliationStatus["IN_PROGRESS"] = "in_progress";
    ReconciliationStatus["COMPLETED"] = "completed";
    ReconciliationStatus["APPROVED"] = "approved";
    ReconciliationStatus["VARIANCE_FOUND"] = "variance_found";
    ReconciliationStatus["REQUIRES_REVIEW"] = "requires_review";
})(ReconciliationStatus || (exports.ReconciliationStatus = ReconciliationStatus = {}));
let CashBreakdown = class CashBreakdown {
};
exports.CashBreakdown = CashBreakdown;
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "hundreds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "fifties", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "twenties", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "tens", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "fives", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "ones", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "quarters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "dimes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "nickels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "pennies", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CashBreakdown.prototype, "totalCounted", void 0);
exports.CashBreakdown = CashBreakdown = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CashBreakdown);
let DailyCashData = class DailyCashData {
};
exports.DailyCashData = DailyCashData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailyCashData.prototype, "startingCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailyCashData.prototype, "expectedCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CashBreakdown, required: true }),
    __metadata("design:type", CashBreakdown)
], DailyCashData.prototype, "actualCashCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailyCashData.prototype, "actualCashTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailyCashData.prototype, "variance", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DailyCashData.prototype, "cashSales", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DailyCashData.prototype, "cashRefunds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DailyCashData.prototype, "cashPayouts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DailyCashData.prototype, "tillFloat", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DailyCashData.prototype, "depositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DailyCashData.prototype, "varianceNotes", void 0);
exports.DailyCashData = DailyCashData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DailyCashData);
let BankReconciliationData = class BankReconciliationData {
};
exports.BankReconciliationData = BankReconciliationData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], BankReconciliationData.prototype, "statementDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BankReconciliationData.prototype, "statementBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BankReconciliationData.prototype, "bookBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BankReconciliationData.prototype, "reconciledBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], BankReconciliationData.prototype, "outstandingDeposits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], BankReconciliationData.prototype, "outstandingWithdrawals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], BankReconciliationData.prototype, "bankAdjustments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BankReconciliationData.prototype, "variance", void 0);
exports.BankReconciliationData = BankReconciliationData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BankReconciliationData);
let InventoryReconciliationItem = class InventoryReconciliationItem {
};
exports.InventoryReconciliationItem = InventoryReconciliationItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryReconciliationItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InventoryReconciliationItem.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryReconciliationItem.prototype, "expectedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryReconciliationItem.prototype, "countedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryReconciliationItem.prototype, "variance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryReconciliationItem.prototype, "unitCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryReconciliationItem.prototype, "varianceValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InventoryReconciliationItem.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], InventoryReconciliationItem.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InventoryReconciliationItem.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InventoryReconciliationItem.prototype, "location", void 0);
exports.InventoryReconciliationItem = InventoryReconciliationItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], InventoryReconciliationItem);
let PaymentReconciliationData = class PaymentReconciliationData {
};
exports.PaymentReconciliationData = PaymentReconciliationData;
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PaymentReconciliationData.prototype, "expectedTotals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PaymentReconciliationData.prototype, "actualTotals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PaymentReconciliationData.prototype, "variances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], PaymentReconciliationData.prototype, "creditCardBatches", void 0);
exports.PaymentReconciliationData = PaymentReconciliationData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentReconciliationData);
let Reconciliation = class Reconciliation {
};
exports.Reconciliation = Reconciliation;
__decorate([
    (0, mongoose_1.Prop)({ enum: ReconciliationType, required: true }),
    __metadata("design:type", String)
], Reconciliation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ReconciliationStatus, default: ReconciliationStatus.PENDING }),
    __metadata("design:type", String)
], Reconciliation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Outlet', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reconciliation.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reconciliation.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reconciliation.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reconciliation.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Reconciliation.prototype, "reconciliationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: DailyCashData }),
    __metadata("design:type", DailyCashData)
], Reconciliation.prototype, "cashData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BankReconciliationData }),
    __metadata("design:type", BankReconciliationData)
], Reconciliation.prototype, "bankData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [InventoryReconciliationItem] }),
    __metadata("design:type", Array)
], Reconciliation.prototype, "inventoryItems", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentReconciliationData }),
    __metadata("design:type", PaymentReconciliationData)
], Reconciliation.prototype, "paymentData", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Reconciliation.prototype, "totalVariance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Reconciliation.prototype, "hasSignificantVariance", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Reconciliation.prototype, "varianceThreshold", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reconciliation.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reconciliation.prototype, "managerNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Reconciliation.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "reviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reconciliation.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Reconciliation.prototype, "auditTrail", void 0);
exports.Reconciliation = Reconciliation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reconciliation);
exports.ReconciliationSchema = mongoose_1.SchemaFactory.createForClass(Reconciliation);
exports.ReconciliationSchema.index({ outletId: 1, type: 1, reconciliationDate: -1 });
exports.ReconciliationSchema.index({ status: 1, createdAt: -1 });
exports.ReconciliationSchema.index({ performedBy: 1, reconciliationDate: -1 });
exports.ReconciliationSchema.index({ hasSignificantVariance: 1, status: 1 });
//# sourceMappingURL=reconciliation.schema.js.map