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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sale_schema_1 = require("../../schemas/sale.schema");
const products_service_1 = require("../products/products.service");
let SalesService = class SalesService {
    constructor(saleModel, productsService) {
        this.saleModel = saleModel;
        this.productsService = productsService;
    }
    async create(createSaleDto) {
        const receiptNumber = await this.generateReceiptNumber();
        for (const item of createSaleDto.items) {
            await this.productsService.updateStock(item.productId.toString(), -item.quantity);
        }
        const sale = new this.saleModel({
            ...createSaleDto,
            receiptNumber,
        });
        return sale.save();
    }
    async findAll(outletId, startDate, endDate) {
        const filter = {};
        if (outletId) {
            filter.outletId = outletId;
        }
        if (startDate || endDate) {
            filter.saleDate = {};
            if (startDate)
                filter.saleDate.$gte = startDate;
            if (endDate)
                filter.saleDate.$lte = endDate;
        }
        return this.saleModel.find(filter).populate("outletId").populate("cashierId").sort({ saleDate: -1 }).exec();
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate("outletId").populate("cashierId").exec();
        if (!sale) {
            throw new common_1.NotFoundException("Sale not found");
        }
        return sale;
    }
    async getDailySales(outletId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const filter = {
            saleDate: { $gte: today, $lt: tomorrow },
            status: "completed",
        };
        if (outletId) {
            filter.outletId = outletId;
        }
        const sales = await this.saleModel.find(filter).exec();
        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalTransactions = sales.length;
        return {
            totalSales,
            totalTransactions,
            sales,
        };
    }
    async generateReceiptNumber() {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
        const lastSale = await this.saleModel
            .findOne({ receiptNumber: { $regex: `^${dateStr}` } })
            .sort({ receiptNumber: -1 })
            .exec();
        let sequence = 1;
        if (lastSale) {
            const lastSequence = Number.parseInt(lastSale.receiptNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `${dateStr}${sequence.toString().padStart(4, "0")}`;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [Function, products_service_1.ProductsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map