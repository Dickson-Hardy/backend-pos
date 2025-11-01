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
exports.SupplierPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const supplier_payment_schema_1 = require("../../schemas/supplier-payment.schema");
let SupplierPaymentsService = class SupplierPaymentsService {
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async create(createDto, userId) {
        const paymentNumber = await this.generatePaymentNumber();
        const payment = new this.paymentModel({
            ...createDto,
            paymentNumber,
            purchaseOrderId: new mongoose_2.Types.ObjectId(createDto.purchaseOrderId),
            supplierId: new mongoose_2.Types.ObjectId(createDto.supplierId),
            outletId: new mongoose_2.Types.ObjectId(createDto.outletId),
            balanceAmount: createDto.totalAmount,
            paidAmount: 0,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return payment.save();
    }
    async recordPayment(id, recordDto, userId) {
        const payment = await this.paymentModel.findById(id);
        if (!payment)
            throw new common_1.NotFoundException("Payment not found");
        const newPaidAmount = payment.paidAmount + recordDto.amount;
        if (newPaidAmount > payment.totalAmount) {
            throw new common_1.BadRequestException("Payment amount exceeds total amount");
        }
        const newBalance = payment.totalAmount - newPaidAmount;
        let status = supplier_payment_schema_1.PaymentStatus.PARTIAL;
        if (newBalance === 0)
            status = supplier_payment_schema_1.PaymentStatus.PAID;
        else if (new Date(payment.dueDate) < new Date())
            status = supplier_payment_schema_1.PaymentStatus.OVERDUE;
        return this.paymentModel.findByIdAndUpdate(id, {
            paidAmount: newPaidAmount,
            balanceAmount: newBalance,
            status,
            paidDate: recordDto.paidDate,
            paymentMethod: recordDto.paymentMethod,
            referenceNumber: recordDto.referenceNumber,
            approvedBy: new mongoose_2.Types.ObjectId(userId),
        }, { new: true }).populate("purchaseOrderId supplierId createdBy approvedBy");
    }
    async findAll(outletId, status) {
        const filter = {};
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        if (status)
            filter.status = status;
        return this.paymentModel
            .find(filter)
            .populate("purchaseOrderId supplierId createdBy approvedBy")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const payment = await this.paymentModel
            .findById(id)
            .populate("purchaseOrderId supplierId createdBy approvedBy")
            .exec();
        if (!payment)
            throw new common_1.NotFoundException("Payment not found");
        return payment;
    }
    async getOverduePayments(outletId) {
        const filter = {
            status: { $in: [supplier_payment_schema_1.PaymentStatus.PENDING, supplier_payment_schema_1.PaymentStatus.PARTIAL] },
            dueDate: { $lt: new Date() }
        };
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        return this.paymentModel.find(filter).populate("supplierId purchaseOrderId").exec();
    }
    async getPaymentStats(outletId) {
        const filter = {};
        if (outletId)
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        const stats = await this.paymentModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalPayments: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" },
                    totalPaid: { $sum: "$paidAmount" },
                    totalBalance: { $sum: "$balanceAmount" },
                    pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
                    overdueCount: { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } },
                }
            }
        ]);
        return stats[0] || {
            totalPayments: 0,
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            pendingCount: 0,
            paidCount: 0,
            overdueCount: 0,
        };
    }
    async generatePaymentNumber() {
        const year = new Date().getFullYear();
        const count = await this.paymentModel.countDocuments({
            paymentNumber: { $regex: `^PAY-${year}-` }
        });
        return `PAY-${year}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.SupplierPaymentsService = SupplierPaymentsService;
exports.SupplierPaymentsService = SupplierPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supplier_payment_schema_1.SupplierPayment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SupplierPaymentsService);
//# sourceMappingURL=supplier-payments.service.js.map