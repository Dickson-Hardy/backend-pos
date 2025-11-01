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
exports.ProductTransfersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_transfer_schema_1 = require("../../schemas/product-transfer.schema");
const product_schema_1 = require("../../schemas/product.schema");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let ProductTransfersService = class ProductTransfersService {
    constructor(transferModel, productModel, websocketGateway) {
        this.transferModel = transferModel;
        this.productModel = productModel;
        this.websocketGateway = websocketGateway;
    }
    async create(createDto, userId) {
        if (createDto.fromOutletId === createDto.toOutletId) {
            throw new common_1.BadRequestException("Cannot transfer to the same outlet");
        }
        for (const item of createDto.items) {
            const product = await this.productModel.findOne({
                _id: new mongoose_2.Types.ObjectId(item.productId),
                outletId: new mongoose_2.Types.ObjectId(createDto.fromOutletId)
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productName} not found in source outlet`);
            }
            if (product.stockQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${item.productName}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
            }
        }
        const transferNumber = await this.generateTransferNumber();
        const transfer = new this.transferModel({
            ...createDto,
            transferNumber,
            fromOutletId: new mongoose_2.Types.ObjectId(createDto.fromOutletId),
            toOutletId: new mongoose_2.Types.ObjectId(createDto.toOutletId),
            initiatedBy: new mongoose_2.Types.ObjectId(userId),
            items: createDto.items.map(item => ({
                ...item,
                productId: new mongoose_2.Types.ObjectId(item.productId)
            }))
        });
        return transfer.save();
    }
    async approve(id, userId) {
        const transfer = await this.transferModel.findById(id);
        if (!transfer)
            throw new common_1.NotFoundException("Transfer not found");
        if (transfer.status !== product_transfer_schema_1.TransferStatus.PENDING) {
            throw new common_1.BadRequestException("Transfer already processed");
        }
        for (const item of transfer.items) {
            await this.productModel.findOneAndUpdate({ _id: item.productId, outletId: transfer.fromOutletId }, { $inc: { stockQuantity: -item.quantity } });
        }
        transfer.status = product_transfer_schema_1.TransferStatus.IN_TRANSIT;
        transfer.approvedBy = new mongoose_2.Types.ObjectId(userId);
        transfer.approvedAt = new Date();
        return transfer.save();
    }
    async complete(id, userId) {
        const transfer = await this.transferModel.findById(id);
        if (!transfer)
            throw new common_1.NotFoundException("Transfer not found");
        if (transfer.status !== product_transfer_schema_1.TransferStatus.IN_TRANSIT) {
            throw new common_1.BadRequestException("Transfer must be in transit");
        }
        for (const item of transfer.items) {
            const sourceProduct = await this.productModel.findOne({
                _id: item.productId,
                outletId: transfer.fromOutletId
            });
            if (!sourceProduct)
                continue;
            const destProduct = await this.productModel.findOne({
                name: sourceProduct.name,
                sku: sourceProduct.sku,
                outletId: transfer.toOutletId
            });
            if (destProduct) {
                await this.productModel.findByIdAndUpdate(destProduct._id, {
                    $inc: { stockQuantity: item.quantity }
                });
            }
            else {
                const newProduct = new this.productModel({
                    ...sourceProduct.toObject(),
                    _id: undefined,
                    outletId: transfer.toOutletId,
                    stockQuantity: item.quantity,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await newProduct.save();
            }
        }
        transfer.status = product_transfer_schema_1.TransferStatus.COMPLETED;
        transfer.receivedBy = new mongoose_2.Types.ObjectId(userId);
        transfer.receivedAt = new Date();
        const savedTransfer = await transfer.save();
        this.websocketGateway.emitToOutlet(transfer.fromOutletId.toString(), 'transfer:completed', { transferId: savedTransfer._id });
        this.websocketGateway.emitToOutlet(transfer.toOutletId.toString(), 'transfer:completed', { transferId: savedTransfer._id });
        return savedTransfer;
    }
    async cancel(id) {
        const transfer = await this.transferModel.findById(id);
        if (!transfer)
            throw new common_1.NotFoundException("Transfer not found");
        if (transfer.status === product_transfer_schema_1.TransferStatus.COMPLETED) {
            throw new common_1.BadRequestException("Cannot cancel completed transfer");
        }
        if (transfer.status === product_transfer_schema_1.TransferStatus.IN_TRANSIT) {
            for (const item of transfer.items) {
                await this.productModel.findOneAndUpdate({ _id: item.productId, outletId: transfer.fromOutletId }, { $inc: { stockQuantity: item.quantity } });
            }
        }
        transfer.status = product_transfer_schema_1.TransferStatus.CANCELLED;
        return transfer.save();
    }
    async findAll(outletId, status) {
        const filter = {};
        if (outletId) {
            filter.$or = [
                { fromOutletId: new mongoose_2.Types.ObjectId(outletId) },
                { toOutletId: new mongoose_2.Types.ObjectId(outletId) }
            ];
        }
        if (status)
            filter.status = status;
        return this.transferModel
            .find(filter)
            .populate("fromOutletId toOutletId initiatedBy approvedBy receivedBy")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const transfer = await this.transferModel
            .findById(id)
            .populate("fromOutletId toOutletId initiatedBy approvedBy receivedBy")
            .exec();
        if (!transfer)
            throw new common_1.NotFoundException("Transfer not found");
        return transfer;
    }
    async getStats(outletId) {
        const filter = {};
        if (outletId) {
            filter.$or = [
                { fromOutletId: new mongoose_2.Types.ObjectId(outletId) },
                { toOutletId: new mongoose_2.Types.ObjectId(outletId) }
            ];
        }
        const stats = await this.transferModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalTransfers: { $sum: 1 },
                    pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    inTransitCount: { $sum: { $cond: [{ $eq: ["$status", "in_transit"] }, 1, 0] } },
                    completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    cancelledCount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                }
            }
        ]);
        return stats[0] || {
            totalTransfers: 0,
            pendingCount: 0,
            inTransitCount: 0,
            completedCount: 0,
            cancelledCount: 0,
        };
    }
    async generateTransferNumber() {
        const year = new Date().getFullYear();
        const count = await this.transferModel.countDocuments({
            transferNumber: { $regex: `^TRF-${year}-` }
        });
        return `TRF-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.ProductTransfersService = ProductTransfersService;
exports.ProductTransfersService = ProductTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_transfer_schema_1.ProductTransfer.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        websocket_gateway_1.WebsocketGateway])
], ProductTransfersService);
//# sourceMappingURL=product-transfers.service.js.map