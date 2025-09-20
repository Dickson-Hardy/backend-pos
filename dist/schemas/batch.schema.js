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
exports.BatchSchema = exports.Batch = exports.BatchStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var BatchStatus;
(function (BatchStatus) {
    BatchStatus["ACTIVE"] = "active";
    BatchStatus["EXPIRED"] = "expired";
    BatchStatus["RECALLED"] = "recalled";
    BatchStatus["SOLD_OUT"] = "sold_out";
})(BatchStatus || (exports.BatchStatus = BatchStatus = {}));
let Batch = class Batch {
};
exports.Batch = Batch;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Batch.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Product", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Batch.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Batch.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Batch.prototype, "manufacturingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Batch.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Batch.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Batch.prototype, "soldQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Batch.prototype, "costPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Batch.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: BatchStatus.ACTIVE, enum: BatchStatus }),
    __metadata("design:type", String)
], Batch.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Batch.prototype, "supplierName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Batch.prototype, "supplierInvoice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Batch.prototype, "notes", void 0);
exports.Batch = Batch = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Batch);
exports.BatchSchema = mongoose_1.SchemaFactory.createForClass(Batch);
//# sourceMappingURL=batch.schema.js.map