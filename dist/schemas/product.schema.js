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
exports.ProductSchema = exports.Product = exports.UnitOfMeasure = exports.ProductStatus = exports.ProductCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["PRESCRIPTION"] = "prescription";
    ProductCategory["OTC"] = "otc";
    ProductCategory["PAIN_RELIEF"] = "pain_relief";
    ProductCategory["ANTIBIOTICS"] = "antibiotics";
    ProductCategory["CARDIOVASCULAR"] = "cardiovascular";
    ProductCategory["DIABETES"] = "diabetes";
    ProductCategory["GASTROINTESTINAL"] = "gastrointestinal";
    ProductCategory["RESPIRATORY"] = "respiratory";
    ProductCategory["MENTAL_HEALTH"] = "mental_health";
    ProductCategory["VITAMINS"] = "vitamins";
    ProductCategory["DERMATOLOGY"] = "dermatology";
    ProductCategory["MEDICAL_EQUIPMENT"] = "medical_equipment";
    ProductCategory["SUPPLEMENTS"] = "supplements";
    ProductCategory["PERSONAL_CARE"] = "personal_care";
    ProductCategory["FIRST_AID"] = "first_aid";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["DISCONTINUED"] = "discontinued";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var UnitOfMeasure;
(function (UnitOfMeasure) {
    UnitOfMeasure["TABLETS"] = "tablets";
    UnitOfMeasure["CAPSULES"] = "capsules";
    UnitOfMeasure["SOFTGELS"] = "softgels";
    UnitOfMeasure["INHALERS"] = "inhalers";
    UnitOfMeasure["TUBES"] = "tubes";
    UnitOfMeasure["ML"] = "ml";
    UnitOfMeasure["MG"] = "mg";
    UnitOfMeasure["GRAMS"] = "grams";
    UnitOfMeasure["PIECES"] = "pieces";
    UnitOfMeasure["BOTTLES"] = "bottles";
    UnitOfMeasure["BOXES"] = "boxes";
    UnitOfMeasure["STRIPS"] = "strips";
    UnitOfMeasure["VIALS"] = "vials";
})(UnitOfMeasure || (exports.UnitOfMeasure = UnitOfMeasure = {}));
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "barcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProductCategory }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "manufacturer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "genericName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "strength", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: UnitOfMeasure }),
    __metadata("design:type", String)
], Product.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "costPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stockQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 10 }),
    __metadata("design:type", Number)
], Product.prototype, "reorderLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], Product.prototype, "maxStockLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: ProductStatus.ACTIVE, enum: ProductStatus }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "requiresPrescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Product.prototype, "activeIngredients", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Product.prototype, "sideEffects", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "dosageInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "storageInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Outlet" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "allowUnitSale", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.index({ sku: 1, outletId: 1 }, { unique: true });
exports.ProductSchema.virtual('packVariants', {
    ref: 'PackVariant',
    localField: '_id',
    foreignField: 'productId',
});
exports.ProductSchema.set('toJSON', { virtuals: true });
exports.ProductSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=product.schema.js.map