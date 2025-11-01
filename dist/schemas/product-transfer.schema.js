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
exports.ProductTransferSchema = exports.ProductTransfer = exports.TransferItem = exports.TransferStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "pending";
    TransferStatus["IN_TRANSIT"] = "in_transit";
    TransferStatus["COMPLETED"] = "completed";
    TransferStatus["CANCELLED"] = "cancelled";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
let TransferItem = class TransferItem {
};
exports.TransferItem = TransferItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TransferItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TransferItem.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TransferItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TransferItem.prototype, "batchNumber", void 0);
exports.TransferItem = TransferItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TransferItem);
let ProductTransfer = class ProductTransfer {
};
exports.ProductTransfer = ProductTransfer;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], ProductTransfer.prototype, "transferNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductTransfer.prototype, "fromOutletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductTransfer.prototype, "toOutletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TransferItem], required: true }),
    __metadata("design:type", Array)
], ProductTransfer.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TransferStatus, default: TransferStatus.PENDING }),
    __metadata("design:type", String)
], ProductTransfer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductTransfer.prototype, "initiatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductTransfer.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProductTransfer.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductTransfer.prototype, "receivedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProductTransfer.prototype, "receivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductTransfer.prototype, "notes", void 0);
exports.ProductTransfer = ProductTransfer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProductTransfer);
exports.ProductTransferSchema = mongoose_1.SchemaFactory.createForClass(ProductTransfer);
exports.ProductTransferSchema.index({ fromOutletId: 1 });
exports.ProductTransferSchema.index({ toOutletId: 1 });
exports.ProductTransferSchema.index({ status: 1 });
exports.ProductTransferSchema.index({ transferNumber: 1 });
//# sourceMappingURL=product-transfer.schema.js.map