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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const purchase_order_schema_1 = require("../../schemas/purchase-order.schema");
let PurchaseOrdersService = class PurchaseOrdersService {
    constructor(purchaseOrderModel) {
        this.purchaseOrderModel = purchaseOrderModel;
    }
    async create(createPurchaseOrderDto, userId) {
        const orderNumber = await this.generateOrderNumber();
        const purchaseOrder = new this.purchaseOrderModel({
            ...createPurchaseOrderDto,
            orderNumber,
            createdBy: userId,
            status: purchase_order_schema_1.PurchaseOrderStatus.DRAFT,
        });
        return purchaseOrder.save();
    }
    async findAll(outletId) {
        const filter = {};
        if (outletId)
            filter.outletId = outletId;
        return this.purchaseOrderModel
            .find(filter)
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const purchaseOrder = await this.purchaseOrderModel
            .findById(id)
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode price")
            .exec();
        if (!purchaseOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return purchaseOrder;
    }
    async update(id, updatePurchaseOrderDto) {
        const updatedOrder = await this.purchaseOrderModel
            .findByIdAndUpdate(id, updatePurchaseOrderDto, { new: true })
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode")
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async approve(id, userId) {
        const updatedOrder = await this.purchaseOrderModel
            .findByIdAndUpdate(id, {
            status: purchase_order_schema_1.PurchaseOrderStatus.APPROVED,
            approvedBy: userId,
            approvedAt: new Date(),
        }, { new: true })
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode")
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async cancel(id) {
        const updatedOrder = await this.purchaseOrderModel
            .findByIdAndUpdate(id, { status: purchase_order_schema_1.PurchaseOrderStatus.CANCELLED }, { new: true })
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode")
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async markAsDelivered(id, actualDeliveryDate) {
        const updatedOrder = await this.purchaseOrderModel
            .findByIdAndUpdate(id, {
            status: purchase_order_schema_1.PurchaseOrderStatus.DELIVERED,
            actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : new Date(),
        }, { new: true })
            .populate("createdBy", "firstName lastName email")
            .populate("approvedBy", "firstName lastName email")
            .populate("items.productId", "name barcode")
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async remove(id) {
        const result = await this.purchaseOrderModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
    }
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const count = await this.purchaseOrderModel.countDocuments({
            orderNumber: { $regex: `^PO-${year}-` }
        });
        return `PO-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    async getStatistics(outletId) {
        const filter = {};
        if (outletId)
            filter.outletId = outletId;
        const [total, pending, approved, inTransit, delivered, cancelled] = await Promise.all([
            this.purchaseOrderModel.countDocuments(filter),
            this.purchaseOrderModel.countDocuments({ ...filter, status: purchase_order_schema_1.PurchaseOrderStatus.PENDING }),
            this.purchaseOrderModel.countDocuments({ ...filter, status: purchase_order_schema_1.PurchaseOrderStatus.APPROVED }),
            this.purchaseOrderModel.countDocuments({ ...filter, status: purchase_order_schema_1.PurchaseOrderStatus.IN_TRANSIT }),
            this.purchaseOrderModel.countDocuments({ ...filter, status: purchase_order_schema_1.PurchaseOrderStatus.DELIVERED }),
            this.purchaseOrderModel.countDocuments({ ...filter, status: purchase_order_schema_1.PurchaseOrderStatus.CANCELLED }),
        ]);
        return {
            total,
            pending,
            approved,
            inTransit,
            delivered,
            cancelled,
        };
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(purchase_order_schema_1.PurchaseOrder.name)),
    __metadata("design:paramtypes", [Function])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map