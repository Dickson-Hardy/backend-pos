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
exports.OutletSchema = exports.Outlet = exports.OutletStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var OutletStatus;
(function (OutletStatus) {
    OutletStatus["ACTIVE"] = "active";
    OutletStatus["INACTIVE"] = "inactive";
    OutletStatus["MAINTENANCE"] = "maintenance";
})(OutletStatus || (exports.OutletStatus = OutletStatus = {}));
let Outlet = class Outlet {
};
exports.Outlet = Outlet;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "zipCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Outlet.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Outlet.prototype, "licenseNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Outlet.prototype, "managerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: OutletStatus.ACTIVE, enum: OutletStatus }),
    __metadata("design:type", String)
], Outlet.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Outlet.prototype, "totalSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Outlet.prototype, "totalTransactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            open: String,
            close: String,
            days: [String],
        },
    }),
    __metadata("design:type", Object)
], Outlet.prototype, "operatingHours", void 0);
exports.Outlet = Outlet = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Outlet);
exports.OutletSchema = mongoose_1.SchemaFactory.createForClass(Outlet);
//# sourceMappingURL=outlet.schema.js.map