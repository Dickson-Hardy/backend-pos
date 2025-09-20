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
exports.PurchaseOrderSchema = exports.PurchaseOrder = exports.PurchaseOrderItem = exports.PurchaseOrderPriority = exports.PurchaseOrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["PENDING"] = "pending";
    PurchaseOrderStatus["APPROVED"] = "approved";
    PurchaseOrderStatus["IN_TRANSIT"] = "in_transit";
    PurchaseOrderStatus["DELIVERED"] = "delivered";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
var PurchaseOrderPriority;
(function (PurchaseOrderPriority) {
    PurchaseOrderPriority["LOW"] = "low";
    PurchaseOrderPriority["NORMAL"] = "normal";
    PurchaseOrderPriority["HIGH"] = "high";
    PurchaseOrderPriority["URGENT"] = "urgent";
})(PurchaseOrderPriority || (exports.PurchaseOrderPriority = PurchaseOrderPriority = {}));
let PurchaseOrderItem = class PurchaseOrderItem {
};
exports.PurchaseOrderItem = PurchaseOrderItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PurchaseOrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unitCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "totalCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "notes", void 0);
exports.PurchaseOrderItem = PurchaseOrderItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PurchaseOrderItem);
let PurchaseOrder = class PurchaseOrder {
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PurchaseOrder.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PurchaseOrder.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PurchaseOrderItem], required: true }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PurchaseOrderPriority, default: PurchaseOrderPriority.NORMAL }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "orderDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PurchaseOrder.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "approvedAt", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PurchaseOrder);
exports.PurchaseOrderSchema = mongoose_1.SchemaFactory.createForClass(PurchaseOrder);
//# sourceMappingURL=purchase-order.schema.js.map