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
exports.SalePackInfoSchema = exports.SalePackInfo = exports.SaleType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SaleType;
(function (SaleType) {
    SaleType["UNIT"] = "unit";
    SaleType["PACK"] = "pack";
})(SaleType || (exports.SaleType = SaleType = {}));
let SalePackInfo = class SalePackInfo {
};
exports.SalePackInfo = SalePackInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: SaleType }),
    __metadata("design:type", String)
], SalePackInfo.prototype, "saleType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "PackVariant" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalePackInfo.prototype, "packVariantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalePackInfo.prototype, "packQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalePackInfo.prototype, "unitQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SalePackInfo.prototype, "effectiveUnitCount", void 0);
exports.SalePackInfo = SalePackInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SalePackInfo);
exports.SalePackInfoSchema = mongoose_1.SchemaFactory.createForClass(SalePackInfo);
//# sourceMappingURL=sale-pack-info.schema.js.map