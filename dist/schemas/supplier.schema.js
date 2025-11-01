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
exports.SupplierSchema = exports.Supplier = exports.SupplierStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SupplierStatus;
(function (SupplierStatus) {
    SupplierStatus["ACTIVE"] = "active";
    SupplierStatus["INACTIVE"] = "inactive";
    SupplierStatus["SUSPENDED"] = "suspended";
})(SupplierStatus || (exports.SupplierStatus = SupplierStatus = {}));
let Supplier = class Supplier {
};
exports.Supplier = Supplier;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Supplier.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Supplier.prototype, "contactPerson", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Supplier.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Supplier.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Supplier.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: SupplierStatus.ACTIVE, enum: SupplierStatus }),
    __metadata("design:type", String)
], Supplier.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 5 }),
    __metadata("design:type", Number)
], Supplier.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Supplier.prototype, "productsSupplied", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Supplier.prototype, "lastOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "30 days" }),
    __metadata("design:type", String)
], Supplier.prototype, "paymentTerms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Supplier.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Supplier.prototype, "taxId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Supplier.prototype, "bankDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Supplier.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Supplier.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Supplier.prototype, "outletId", void 0);
exports.Supplier = Supplier = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Supplier);
exports.SupplierSchema = mongoose_1.SchemaFactory.createForClass(Supplier);
exports.SupplierSchema.index({ name: 1, outletId: 1 }, { unique: true });
exports.SupplierSchema.index({ email: 1 });
exports.SupplierSchema.index({ status: 1 });
exports.SupplierSchema.index({ outletId: 1 });
//# sourceMappingURL=supplier.schema.js.map