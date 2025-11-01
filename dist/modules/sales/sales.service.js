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
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("../../schemas/sale.schema");
const pack_variant_schema_1 = require("../../schemas/pack-variant.schema");
const products_service_1 = require("../products/products.service");
const shifts_service_1 = require("../shifts/shifts.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let SalesService = class SalesService {
    constructor(saleModel, packVariantModel, productsService, shiftsService, websocketGateway) {
        this.saleModel = saleModel;
        this.packVariantModel = packVariantModel;
        this.productsService = productsService;
        this.shiftsService = shiftsService;
        this.websocketGateway = websocketGateway;
    }
    async create(createSaleDto) {
        const receiptNumber = await this.generateReceiptNumber();
        for (const item of createSaleDto.items) {
            if (item.packInfo) {
                await this.processPackSale(item.productId.toString(), item.packInfo);
            }
            else {
                await this.productsService.updateStock(item.productId.toString(), -item.quantity);
            }
        }
        const saleData = {
            ...createSaleDto,
            receiptNumber,
            outletId: new mongoose_2.Types.ObjectId(createSaleDto.outletId),
            cashierId: new mongoose_2.Types.ObjectId(createSaleDto.cashierId),
        };
        const sale = new this.saleModel(saleData);
        const savedSale = await sale.save();
        try {
            const currentShift = await this.shiftsService.getCurrentShift(createSaleDto.cashierId);
            if (currentShift) {
                await this.shiftsService.updateShiftSales(currentShift._id.toString(), createSaleDto.total);
            }
        }
        catch (error) {
            console.error('Failed to update shift sales:', error);
        }
        this.websocketGateway.emitToOutlet(createSaleDto.outletId, 'sale:completed', {
            saleId: savedSale._id,
            total: savedSale.total,
            items: savedSale.items
        });
        return savedSale;
    }
    async processPackSale(productId, packInfo) {
        if (packInfo.saleType === 'pack' && packInfo.packVariantId) {
            const packVariant = await this.packVariantModel.findById(packInfo.packVariantId).exec();
            if (!packVariant || !packVariant.isActive) {
                throw new common_1.BadRequestException('Invalid or inactive pack variant');
            }
            if (packVariant.productId.toString() !== productId) {
                throw new common_1.BadRequestException('Pack variant does not belong to the specified product');
            }
            const totalUnitsToDeduct = (packInfo.packQuantity || 0) * packVariant.packSize;
            await this.productsService.updateStock(productId, -totalUnitsToDeduct);
        }
        else if (packInfo.saleType === 'unit') {
            await this.productsService.updateStock(productId, -(packInfo.unitQuantity || 0));
        }
        else {
            await this.productsService.updateStock(productId, -packInfo.effectiveUnitCount);
        }
    }
    async findAll(outletId, startDate, endDate, cashierId, status) {
        try {
            const filter = {};
            if (outletId && mongoose_2.Types.ObjectId.isValid(outletId)) {
                filter.outletId = new mongoose_2.Types.ObjectId(outletId);
            }
            if (cashierId && mongoose_2.Types.ObjectId.isValid(cashierId)) {
                filter.cashierId = new mongoose_2.Types.ObjectId(cashierId);
            }
            if (status && status.trim() !== '') {
                filter.status = status;
            }
            if (startDate || endDate) {
                filter.saleDate = {};
                if (startDate)
                    filter.saleDate.$gte = startDate;
                if (endDate)
                    filter.saleDate.$lte = endDate;
            }
            const sales = await this.saleModel.find(filter).populate("outletId").populate("cashierId").sort({ saleDate: -1 }).exec();
            return sales;
        }
        catch (error) {
            console.error('Error in findAll sales:', error);
            throw new common_1.BadRequestException('Failed to fetch sales data');
        }
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate("outletId").populate("cashierId").exec();
        if (!sale) {
            throw new common_1.NotFoundException("Sale not found");
        }
        return sale;
    }
    async getDailySales(outletId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const filter = {
                saleDate: { $gte: today, $lt: tomorrow },
                status: "completed",
            };
            if (outletId) {
                filter.outletId = new mongoose_2.Types.ObjectId(outletId);
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
        catch (error) {
            console.error('Error in getDailySales:', error);
            throw new common_1.BadRequestException('Failed to fetch daily sales data');
        }
    }
    async searchSales(query, outletId) {
        const filter = {
            $or: [
                { receiptNumber: { $regex: query, $options: 'i' } },
                { customerName: { $regex: query, $options: 'i' } },
                { customerPhone: { $regex: query, $options: 'i' } },
            ]
        };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        return this.saleModel.find(filter).populate('cashierId outletId').limit(50).exec();
    }
    async getSalesByHour(outletId, date) {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        const filter = {
            saleDate: { $gte: startOfDay, $lte: endOfDay },
            status: 'completed'
        };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        const hourlyData = await this.saleModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $hour: '$saleDate' },
                    sales: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return hourlyData.map(h => ({ hour: h._id, sales: h.sales, count: h.count }));
    }
    async getSalesByCategory(outletId, startDate, endDate) {
        const filter = { status: 'completed' };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        if (startDate || endDate) {
            filter.saleDate = {};
            if (startDate)
                filter.saleDate.$gte = startDate;
            if (endDate)
                filter.saleDate.$lte = endDate;
        }
        return this.saleModel.aggregate([
            { $match: filter },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    sales: { $sum: '$items.totalPrice' },
                    quantity: { $sum: '$items.quantity' }
                }
            }
        ]);
    }
    async getCashierPerformance(outletId, startDate, endDate) {
        const filter = { status: 'completed' };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        if (startDate || endDate) {
            filter.saleDate = {};
            if (startDate)
                filter.saleDate.$gte = startDate;
            if (endDate)
                filter.saleDate.$lte = endDate;
        }
        return this.saleModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$cashierId',
                    totalSales: { $sum: '$total' },
                    transactionCount: { $sum: 1 },
                    averageTransaction: { $avg: '$total' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cashier'
                }
            },
            { $unwind: '$cashier' },
            { $sort: { totalSales: -1 } }
        ]);
    }
    async getPaymentMethodBreakdown(outletId, startDate, endDate) {
        const filter = { status: 'completed' };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        if (startDate || endDate) {
            filter.saleDate = {};
            if (startDate)
                filter.saleDate.$gte = startDate;
            if (endDate)
                filter.saleDate.$lte = endDate;
        }
        return this.saleModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$paymentMethod',
                    total: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    async getSalesComparison(outletId) {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const filter = { status: 'completed' };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        const [todaySales, yesterdaySales, thisWeekSales, lastWeekSales] = await Promise.all([
            this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: yesterday, $lt: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000), $lt: weekAgo } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }])
        ]);
        return {
            today: todaySales[0] || { total: 0, count: 0 },
            yesterday: yesterdaySales[0] || { total: 0, count: 0 },
            thisWeek: thisWeekSales[0] || { total: 0, count: 0 },
            lastWeek: lastWeekSales[0] || { total: 0, count: 0 }
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
    __param(1, (0, mongoose_1.InjectModel)(pack_variant_schema_1.PackVariant.name)),
    __metadata("design:paramtypes", [Function, Function, products_service_1.ProductsService,
        shifts_service_1.ShiftsService,
        websocket_gateway_1.WebsocketGateway])
], SalesService);
//# sourceMappingURL=sales.service.js.map