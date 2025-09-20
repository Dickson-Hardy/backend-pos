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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const inventory_adjustment_schema_1 = require("../../schemas/inventory-adjustment.schema");
const products_service_1 = require("../products/products.service");
let InventoryService = class InventoryService {
    constructor(inventoryAdjustmentModel, productsService) {
        this.inventoryAdjustmentModel = inventoryAdjustmentModel;
        this.productsService = productsService;
    }
    async adjustInventory(createAdjustmentDto) {
        const product = await this.productsService.findOne(createAdjustmentDto.productId);
        const adjustment = new this.inventoryAdjustmentModel({
            ...createAdjustmentDto,
            previousQuantity: product.stockQuantity,
            newQuantity: product.stockQuantity + createAdjustmentDto.adjustedQuantity,
        });
        await adjustment.save();
        await this.productsService.updateStock(createAdjustmentDto.productId, createAdjustmentDto.adjustedQuantity);
        return adjustment;
    }
    async getAdjustmentHistory(outletId, productId) {
        const filter = {};
        if (outletId)
            filter.outletId = outletId;
        if (productId)
            filter.productId = productId;
        return this.inventoryAdjustmentModel
            .find(filter)
            .populate("productId")
            .populate("adjustedBy")
            .sort({ adjustmentDate: -1 })
            .exec();
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_adjustment_schema_1.InventoryAdjustment.name)),
    __metadata("design:paramtypes", [Function, products_service_1.ProductsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map