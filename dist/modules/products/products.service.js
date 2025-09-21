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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../../schemas/product.schema");
const batch_schema_1 = require("../../schemas/batch.schema");
const pack_variant_schema_1 = require("../../schemas/pack-variant.schema");
let ProductsService = class ProductsService {
    constructor(productModel, batchModel, packVariantModel) {
        this.productModel = productModel;
        this.batchModel = batchModel;
        this.packVariantModel = packVariantModel;
    }
    async create(createProductDto) {
        const { packVariants, ...productData } = createProductDto;
        const product = new this.productModel(productData);
        const savedProduct = await product.save();
        if (packVariants && packVariants.length > 0) {
            const packVariantDocs = packVariants.map(variant => ({
                ...variant,
                productId: savedProduct._id,
            }));
            await this.packVariantModel.insertMany(packVariantDocs);
        }
        return this.findOne(savedProduct._id.toString());
    }
    async findAll(outletId) {
        const filter = outletId ? { outletId } : {};
        return this.productModel
            .find(filter)
            .populate("outletId")
            .populate("packVariants")
            .exec();
    }
    async findOne(id) {
        const product = await this.productModel
            .findById(id)
            .populate("outletId")
            .populate("packVariants")
            .exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async update(id, updateProductDto) {
        const { packVariants, ...productData } = updateProductDto;
        const product = await this.productModel.findByIdAndUpdate(id, productData, { new: true }).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        if (packVariants !== undefined) {
            await this.packVariantModel.deleteMany({ productId: id }).exec();
            if (packVariants.length > 0) {
                const packVariantDocs = packVariants.map(variant => ({
                    ...variant,
                    productId: id,
                }));
                await this.packVariantModel.insertMany(packVariantDocs);
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("Product not found");
        }
        await this.packVariantModel.deleteMany({ productId: id }).exec();
    }
    async findByBarcode(barcode) {
        const product = await this.productModel.findOne({ barcode }).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async findLowStock(outletId) {
        const filter = {
            $expr: { $lte: ["$stockQuantity", "$reorderLevel"] },
        };
        if (outletId) {
            filter.outletId = outletId;
        }
        return this.productModel.find(filter).exec();
    }
    async search(query) {
        const searchFilter = {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { genericName: { $regex: query, $options: "i" } },
                { manufacturer: { $regex: query, $options: "i" } },
                { sku: { $regex: query, $options: "i" } },
                { barcode: { $regex: query, $options: "i" } },
            ],
        };
        return this.productModel.find(searchFilter).exec();
    }
    async updateStock(productId, quantity) {
        const product = await this.productModel
            .findByIdAndUpdate(productId, { $inc: { stockQuantity: quantity } }, { new: true })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async getPackVariants(productId) {
        return this.packVariantModel.find({ productId }).exec();
    }
    async calculatePackInventory(totalUnits, packVariants) {
        const sortedVariants = packVariants
            .filter(v => v.isActive)
            .sort((a, b) => b.packSize - a.packSize);
        let remainingUnits = totalUnits;
        const packBreakdown = [];
        let totalValue = 0;
        for (const variant of sortedVariants) {
            const availablePacks = Math.floor(remainingUnits / variant.packSize);
            if (availablePacks > 0) {
                packBreakdown.push({ variant, availablePacks });
                const unitsUsed = availablePacks * variant.packSize;
                remainingUnits -= unitsUsed;
                totalValue += availablePacks * variant.packPrice;
            }
        }
        totalValue += remainingUnits * (sortedVariants[0]?.unitPrice || 0);
        return {
            packBreakdown,
            looseUnits: remainingUnits,
            totalValue
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(batch_schema_1.Batch.name)),
    __param(2, (0, mongoose_1.InjectModel)(pack_variant_schema_1.PackVariant.name)),
    __metadata("design:paramtypes", [Function, Function, Function])
], ProductsService);
//# sourceMappingURL=products.service.js.map