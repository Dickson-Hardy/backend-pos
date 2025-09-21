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
const pack_variant_schema_1 = require("../../schemas/pack-variant.schema");
const batch_schema_1 = require("../../schemas/batch.schema");
const products_service_1 = require("../products/products.service");
const pack_utils_1 = require("../../utils/pack-utils");
let InventoryService = class InventoryService {
    constructor(inventoryAdjustmentModel, packVariantModel, batchModel, productsService) {
        this.inventoryAdjustmentModel = inventoryAdjustmentModel;
        this.packVariantModel = packVariantModel;
        this.batchModel = batchModel;
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
    async getEnhancedInventory(outletId) {
        const products = await this.productsService.findAll(outletId);
        const enhancedInventory = [];
        for (const product of products) {
            const productDoc = product;
            const packVariants = await this.packVariantModel.find({ productId: productDoc._id }).exec();
            const breakdown = pack_utils_1.PackUtils.calculatePackInventory(product.stockQuantity, packVariants);
            enhancedInventory.push({
                productId: productDoc._id.toString(),
                productName: product.name,
                totalUnits: product.stockQuantity,
                packBreakdown: breakdown.packBreakdown,
                looseUnits: breakdown.looseUnits,
                totalValue: breakdown.totalValue,
                formattedDisplay: pack_utils_1.PackUtils.formatInventoryDisplay(product.stockQuantity, packVariants),
                reorderLevel: product.reorderLevel,
                maxStockLevel: product.maxStockLevel,
                needsReorder: product.stockQuantity <= product.reorderLevel,
            });
        }
        return enhancedInventory;
    }
    async getProductPackInfo(productId) {
        const product = await this.productsService.findOne(productId);
        const packVariants = await this.packVariantModel.find({ productId }).exec();
        const breakdown = pack_utils_1.PackUtils.calculatePackInventory(product.stockQuantity, packVariants);
        return {
            totalUnits: product.stockQuantity,
            packBreakdown: breakdown.packBreakdown,
            looseUnits: breakdown.looseUnits,
            formattedDisplay: pack_utils_1.PackUtils.formatInventoryDisplay(product.stockQuantity, packVariants),
        };
    }
    async updateInventoryItem(productId, update) {
        const product = await this.productsService.update(productId, update);
        return product;
    }
    async listBatches(outletId, productId) {
        const filter = {};
        if (outletId)
            filter.outletId = outletId;
        if (productId)
            filter.productId = productId;
        return this.batchModel.find(filter).exec();
    }
    async getBatch(id) {
        const batch = await this.batchModel.findById(id).exec();
        if (!batch)
            throw new common_1.NotFoundException('Batch not found');
        return batch;
    }
    async createBatch(dto) {
        const batch = new this.batchModel({
            ...dto,
            manufacturingDate: new Date(dto.manufacturingDate),
            expiryDate: new Date(dto.expiryDate),
        });
        return batch.save();
    }
    async updateBatch(id, dto) {
        const update = { ...dto };
        if (dto.manufacturingDate)
            update.manufacturingDate = new Date(dto.manufacturingDate);
        if (dto.expiryDate)
            update.expiryDate = new Date(dto.expiryDate);
        const batch = await this.batchModel.findByIdAndUpdate(id, update, { new: true }).exec();
        if (!batch)
            throw new common_1.NotFoundException('Batch not found');
        return batch;
    }
    async deleteBatch(id) {
        const res = await this.batchModel.findByIdAndDelete(id).exec();
        if (!res)
            throw new common_1.NotFoundException('Batch not found');
        return { success: true };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_adjustment_schema_1.InventoryAdjustment.name)),
    __param(1, (0, mongoose_1.InjectModel)(pack_variant_schema_1.PackVariant.name)),
    __param(2, (0, mongoose_1.InjectModel)(batch_schema_1.Batch.name)),
    __metadata("design:paramtypes", [Function, Function, Function, products_service_1.ProductsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map