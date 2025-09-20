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
exports.SaleSchema = exports.Sale = exports.SaleItem = exports.SaleStatus = exports.PaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["MOBILE"] = "mobile";
    PaymentMethod["INSURANCE"] = "insurance";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var SaleStatus;
(function (SaleStatus) {
    SaleStatus["COMPLETED"] = "completed";
    SaleStatus["PENDING"] = "pending";
    SaleStatus["CANCELLED"] = "cancelled";
    SaleStatus["REFUNDED"] = "refunded";
})(SaleStatus || (exports.SaleStatus = SaleStatus = {}));
let SaleItem = class SaleItem {
};
exports.SaleItem = SaleItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SaleItem.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SaleItem.prototype, "discount", void 0);
exports.SaleItem = SaleItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SaleItem);
let Sale = class Sale {
};
exports.Sale = Sale;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Sale.prototype, "receiptNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sale.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sale.prototype, "cashierId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], Sale.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Sale.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Sale.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PaymentMethod }),
    __metadata("design:type", String)
], Sale.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: SaleStatus.COMPLETED, enum: SaleStatus }),
    __metadata("design:type", String)
], Sale.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "prescriptionNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "doctorName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Sale.prototype, "saleDate", void 0);
exports.Sale = Sale = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Sale);
exports.SaleSchema = mongoose_1.SchemaFactory.createForClass(Sale);
//# sourceMappingURL=sale.schema.js.map