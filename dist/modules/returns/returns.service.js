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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const return_schema_1 = require("../../schemas/return.schema");
const product_schema_1 = require("../../schemas/product.schema");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let ReturnsService = class ReturnsService {
    constructor(returnModel, productModel, websocketGateway) {
        this.returnModel = returnModel;
        this.productModel = productModel;
        this.websocketGateway = websocketGateway;
    }
    async create(createDto, userId) {
        const returnNumber = await this.generateReturnNumber();
        const returnDoc = new this.returnModel({
            ...createDto,
            returnNumber,
            originalSaleId: new mongoose_2.Types.ObjectId(createDto.originalSaleId),
            outletId: new mongoose_2.Types.ObjectId(createDto.outletId),
            processedBy: new mongoose_2.Types.ObjectId(userId),
            items: createDto.items.map(item => ({
                ...item,
                productId: new mongoose_2.Types.ObjectId(item.productId)
            }))
        });
        return returnDoc.save();
    }
    async approve(id, userId) {
        const returnDoc = await this.returnModel.findById(id);
        if (!returnDoc)
            throw new common_1.NotFoundException("Return not found");
        if (returnDoc.status !== return_schema_1.ReturnStatus.PENDING) {
            throw new common_1.BadRequestException("Return already processed");
        }
        returnDoc.status = return_schema_1.ReturnStatus.APPROVED;
        returnDoc.approvedBy = new mongoose_2.Types.ObjectId(userId);
        returnDoc.approvedAt = new Date();
        const savedReturn = await returnDoc.save();
        this.websocketGateway.emitToOutlet(returnDoc.outletId.toString(), 'return:approved', {
            returnId: savedReturn._id,
            productIds: savedReturn.items.map(item => item.productId.toString()),
            totalRefund: savedReturn.totalRefundAmount
        });
        return savedReturn;
    }
    async reject(id, userId) {
        const returnDoc = await this.returnModel.findById(id);
        if (!returnDoc)
            throw new common_1.NotFoundException("Return not found");
        if (returnDoc.status !== return_schema_1.ReturnStatus.PENDING) {
            throw new common_1.BadRequestException("Return already processed");
        }
        returnDoc.status = return_schema_1.ReturnStatus.REJECTED;
        returnDoc.approvedBy = new mongoose_2.Types.ObjectId(userId);
        returnDoc.approvedAt = new Date();
        return returnDoc.save();
    }
    async restockInventory(id) {
        const returnDoc = await this.returnModel.findById(id);
        if (!returnDoc)
            throw new common_1.NotFoundException("Return not found");
        if (returnDoc.status !== return_schema_1.ReturnStatus.APPROVED) {
            throw new common_1.BadRequestException("Return must be approved first");
        }
        if (returnDoc.restockedToInventory) {
            throw new common_1.BadRequestException("Already restocked");
        }
        for (const item of returnDoc.items) {
            await this.productModel.findByIdAndUpdate(item.productId, { $inc: { stockQuantity: item.quantity } });
        }
        returnDoc.restockedToInventory = true;
        returnDoc.status = return_schema_1.ReturnStatus.COMPLETED;
        const savedReturn = await returnDoc.save();
        this.websocketGateway.emitToOutlet(returnDoc.outletId.toString(), 'return:restocked', {
            returnId: savedReturn._id,
            productIds: savedReturn.items.map(item => item.productId.toString())
        });
        return savedReturn;
    }
    async findAll(outletId, status) {
        const filter = {};
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        if (status)
            filter.status = status;
        return this.returnModel
            .find(filter)
            .populate("originalSaleId processedBy approvedBy")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const returnDoc = await this.returnModel
            .findById(id)
            .populate("originalSaleId processedBy approvedBy")
            .exec();
        if (!returnDoc)
            throw new common_1.NotFoundException("Return not found");
        return returnDoc;
    }
    async getReturnStats(outletId) {
        const filter = {};
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        const stats = await this.returnModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalReturns: { $sum: 1 },
                    totalRefundAmount: { $sum: "$totalRefundAmount" },
                    pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    approvedCount: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
                    completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                }
            }
        ]);
        return stats[0] || {
            totalReturns: 0,
            totalRefundAmount: 0,
            pendingCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            completedCount: 0,
        };
    }
    async generateReturnNumber() {
        const year = new Date().getFullYear();
        const count = await this.returnModel.countDocuments({
            returnNumber: { $regex: `^RET-${year}-` }
        });
        return `RET-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(return_schema_1.Return.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        websocket_gateway_1.WebsocketGateway])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map