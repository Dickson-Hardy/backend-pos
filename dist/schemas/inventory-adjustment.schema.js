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
exports.InventoryAdjustmentSchema = exports.InventoryAdjustment = exports.AdjustmentType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AdjustmentType;
(function (AdjustmentType) {
    AdjustmentType["INCREASE"] = "increase";
    AdjustmentType["DECREASE"] = "decrease";
    AdjustmentType["DAMAGE"] = "damage";
    AdjustmentType["EXPIRED"] = "expired";
    AdjustmentType["RETURN"] = "return";
    AdjustmentType["RECOUNT"] = "recount";
})(AdjustmentType || (exports.AdjustmentType = AdjustmentType = {}));
let InventoryAdjustment = class InventoryAdjustment {
};
exports.InventoryAdjustment = InventoryAdjustment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryAdjustment.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryAdjustment.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryAdjustment.prototype, "adjustedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryAdjustment.prototype, "previousQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryAdjustment.prototype, "adjustedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryAdjustment.prototype, "newQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AdjustmentType }),
    __metadata("design:type", String)
], InventoryAdjustment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InventoryAdjustment.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InventoryAdjustment.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InventoryAdjustment.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], InventoryAdjustment.prototype, "adjustmentDate", void 0);
exports.InventoryAdjustment = InventoryAdjustment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InventoryAdjustment);
exports.InventoryAdjustmentSchema = mongoose_1.SchemaFactory.createForClass(InventoryAdjustment);
//# sourceMappingURL=inventory-adjustment.schema.js.map