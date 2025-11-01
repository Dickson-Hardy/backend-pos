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
exports.ReturnSchema = exports.Return = exports.ReturnItem = exports.RefundMethod = exports.ReturnStatus = exports.ReturnReason = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReturnReason;
(function (ReturnReason) {
    ReturnReason["EXPIRED"] = "expired";
    ReturnReason["DAMAGED"] = "damaged";
    ReturnReason["WRONG_ITEM"] = "wrong_item";
    ReturnReason["CUSTOMER_REQUEST"] = "customer_request";
    ReturnReason["DEFECTIVE"] = "defective";
    ReturnReason["OTHER"] = "other";
})(ReturnReason || (exports.ReturnReason = ReturnReason = {}));
var ReturnStatus;
(function (ReturnStatus) {
    ReturnStatus["PENDING"] = "pending";
    ReturnStatus["APPROVED"] = "approved";
    ReturnStatus["REJECTED"] = "rejected";
    ReturnStatus["COMPLETED"] = "completed";
})(ReturnStatus || (exports.ReturnStatus = ReturnStatus = {}));
var RefundMethod;
(function (RefundMethod) {
    RefundMethod["CASH"] = "cash";
    RefundMethod["CARD_REVERSAL"] = "card_reversal";
    RefundMethod["STORE_CREDIT"] = "store_credit";
    RefundMethod["EXCHANGE"] = "exchange";
})(RefundMethod || (exports.RefundMethod = RefundMethod = {}));
let ReturnItem = class ReturnItem {
};
exports.ReturnItem = ReturnItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReturnItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReturnItem.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "totalRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ReturnReason }),
    __metadata("design:type", String)
], ReturnItem.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReturnItem.prototype, "batchNumber", void 0);
exports.ReturnItem = ReturnItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ReturnItem);
let Return = class Return {
};
exports.Return = Return;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Return.prototype, "returnNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Sale", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Return.prototype, "originalSaleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Return.prototype, "originalReceiptNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Return.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Return.prototype, "processedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ReturnItem], required: true }),
    __metadata("design:type", Array)
], Return.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Return.prototype, "totalRefundAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ReturnStatus, default: ReturnStatus.PENDING }),
    __metadata("design:type", String)
], Return.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RefundMethod }),
    __metadata("design:type", String)
], Return.prototype, "refundMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Return.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Return.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Return.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Return.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Return.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Return.prototype, "restockedToInventory", void 0);
exports.Return = Return = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Return);
exports.ReturnSchema = mongoose_1.SchemaFactory.createForClass(Return);
exports.ReturnSchema.index({ originalSaleId: 1 });
exports.ReturnSchema.index({ returnNumber: 1 });
exports.ReturnSchema.index({ status: 1 });
exports.ReturnSchema.index({ outletId: 1 });
//# sourceMappingURL=return.schema.js.map