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
let ProductsService = class ProductsService {
    constructor(productModel, batchModel) {
        this.productModel = productModel;
        this.batchModel = batchModel;
    }
    async create(createProductDto) {
        const product = new this.productModel(createProductDto);
        return product.save();
    }
    async findAll(outletId) {
        const filter = outletId ? { outletId } : {};
        return this.productModel.find(filter).populate("outletId").exec();
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).populate("outletId").exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return product;
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("Product not found");
        }
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(batch_schema_1.Batch.name)),
    __metadata("design:paramtypes", [Function, Function])
], ProductsService);
//# sourceMappingURL=products.service.js.map