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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const create_inventory_adjustment_dto_1 = require("./dto/create-inventory-adjustment.dto");
const products_service_1 = require("../products/products.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_inventory_item_dto_1 = require("./dto/update-inventory-item.dto");
const create_batch_dto_1 = require("./dto/create-batch.dto");
const update_batch_dto_1 = require("./dto/update-batch.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService, productsService) {
        this.inventoryService = inventoryService;
        this.productsService = productsService;
    }
    getItems(outletId) {
        return this.productsService.findAll(outletId);
    }
    async getStats(outletId) {
        const products = await this.productsService.findAll(outletId);
        const lowStockProducts = await this.productsService.findLowStock(outletId);
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => sum + (product.stockQuantity * product.costPrice), 0);
        const lowStockCount = lowStockProducts.length;
        return {
            totalProducts,
            totalValue,
            lowStockCount,
            lowStockProducts,
        };
    }
    adjust(createAdjustmentDto) {
        return this.inventoryService.adjustInventory(createAdjustmentDto);
    }
    getAdjustments(outletId, productId) {
        return this.inventoryService.getAdjustmentHistory(outletId, productId);
    }
    getBatches(outletId, productId) {
        return this.inventoryService.listBatches(outletId, productId);
    }
    updateInventoryItem(productId, dto) {
        return this.inventoryService.updateInventoryItem(productId, dto);
    }
    getBatch(id) {
        return this.inventoryService.getBatch(id);
    }
    createBatch(dto) {
        return this.inventoryService.createBatch(dto);
    }
    updateBatch(id, dto) {
        return this.inventoryService.updateBatch(id, dto);
    }
    deleteBatch(id) {
        return this.inventoryService.deleteBatch(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)("items"),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory items" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItems", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory statistics" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)("adjust"),
    (0, swagger_1.ApiOperation)({ summary: "Adjust inventory" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_adjustment_dto_1.CreateInventoryAdjustmentDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjust", null);
__decorate([
    (0, common_1.Get)("adjustments"),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory adjustment history" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "productId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAdjustments", null);
__decorate([
    (0, common_1.Get)("batches"),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory batches" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "productId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Patch)("items/:productId"),
    (0, swagger_1.ApiOperation)({ summary: "Update inventory item thresholds" }),
    (0, swagger_1.ApiParam)({ name: "productId" }),
    __param(0, (0, common_1.Param)("productId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_item_dto_1.UpdateInventoryItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateInventoryItem", null);
__decorate([
    (0, common_1.Get)("batches/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a batch by id" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getBatch", null);
__decorate([
    (0, common_1.Post)("batches"),
    (0, swagger_1.ApiOperation)({ summary: "Create a batch" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_batch_dto_1.CreateBatchDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Patch)("batches/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a batch" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_batch_dto_1.UpdateBatchDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateBatch", null);
__decorate([
    (0, common_1.Delete)("batches/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a batch" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteBatch", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("inventory"),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        products_service_1.ProductsService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map