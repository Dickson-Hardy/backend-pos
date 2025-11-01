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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const supplier_schema_1 = require("../../schemas/supplier.schema");
let SuppliersService = class SuppliersService {
    constructor(supplierModel) {
        this.supplierModel = supplierModel;
    }
    async create(createSupplierDto) {
        try {
            const supplier = new this.supplierModel({
                ...createSupplierDto,
                outletId: new mongoose_2.Types.ObjectId(createSupplierDto.outletId),
            });
            return await supplier.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException("Supplier with this name already exists for this outlet");
            }
            throw error;
        }
    }
    async findAll(outletId, status) {
        const filter = {};
        if (outletId) {
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        }
        if (status) {
            filter.status = status;
        }
        return await this.supplierModel
            .find(filter)
            .sort({ name: 1 })
            .exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        const supplier = await this.supplierModel.findById(id).exec();
        if (!supplier) {
            throw new common_1.NotFoundException("Supplier not found");
        }
        return supplier;
    }
    async update(id, updateSupplierDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        try {
            const updateData = { ...updateSupplierDto };
            if (updateSupplierDto.outletId) {
                updateData.outletId = new mongoose_2.Types.ObjectId(updateSupplierDto.outletId);
            }
            const supplier = await this.supplierModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();
            if (!supplier) {
                throw new common_1.NotFoundException("Supplier not found");
            }
            return supplier;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException("Supplier with this name already exists for this outlet");
            }
            throw error;
        }
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        const result = await this.supplierModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("Supplier not found");
        }
    }
    async updateRating(id, rating) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        const supplier = await this.supplierModel
            .findByIdAndUpdate(id, { rating: Math.max(0, Math.min(5, rating)) }, { new: true })
            .exec();
        if (!supplier) {
            throw new common_1.NotFoundException("Supplier not found");
        }
        return supplier;
    }
    async updateLastOrder(id, orderDate) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        const supplier = await this.supplierModel
            .findByIdAndUpdate(id, { lastOrder: orderDate }, { new: true })
            .exec();
        if (!supplier) {
            throw new common_1.NotFoundException("Supplier not found");
        }
        return supplier;
    }
    async incrementProductsSupplied(id, count = 1) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Invalid supplier ID");
        }
        const supplier = await this.supplierModel
            .findByIdAndUpdate(id, { $inc: { productsSupplied: count } }, { new: true })
            .exec();
        if (!supplier) {
            throw new common_1.NotFoundException("Supplier not found");
        }
        return supplier;
    }
    async getSupplierStats(outletId) {
        const filter = {};
        if (outletId) {
            filter.outletId = new mongoose_2.Types.ObjectId(outletId);
        }
        const stats = await this.supplierModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalSuppliers: { $sum: 1 },
                    activeSuppliers: {
                        $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                    },
                    inactiveSuppliers: {
                        $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] }
                    },
                    suspendedSuppliers: {
                        $sum: { $cond: [{ $eq: ["$status", "suspended"] }, 1, 0] }
                    },
                    averageRating: { $avg: "$rating" },
                    totalProductsSupplied: { $sum: "$productsSupplied" }
                }
            }
        ]);
        return stats[0] || {
            totalSuppliers: 0,
            activeSuppliers: 0,
            inactiveSuppliers: 0,
            suspendedSuppliers: 0,
            averageRating: 0,
            totalProductsSupplied: 0
        };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map