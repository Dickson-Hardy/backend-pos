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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_schema_1 = require("../../schemas/shift.schema");
const expense_schema_1 = require("../../schemas/expense.schema");
let ShiftsService = class ShiftsService {
    constructor(shiftModel, expenseModel) {
        this.shiftModel = shiftModel;
        this.expenseModel = expenseModel;
    }
    async createShift(createShiftDto, cashierId, outletId) {
        const activeShift = await this.shiftModel.findOne({
            cashierId: new mongoose_2.Types.ObjectId(cashierId),
            status: 'active'
        });
        if (activeShift) {
            throw new common_1.BadRequestException('Cashier already has an active shift');
        }
        const shift = new this.shiftModel({
            ...createShiftDto,
            cashierId: new mongoose_2.Types.ObjectId(cashierId),
            outletId: new mongoose_2.Types.ObjectId(outletId),
            startTime: new Date(),
            netAmount: createShiftDto.openingBalance,
        });
        return shift.save();
    }
    async endShift(shiftId, endShiftDto, cashierId) {
        const shift = await this.shiftModel.findOne({
            _id: new mongoose_2.Types.ObjectId(shiftId),
            cashierId: new mongoose_2.Types.ObjectId(cashierId),
            status: 'active'
        });
        if (!shift) {
            throw new common_1.NotFoundException('Active shift not found');
        }
        const closingBalance = endShiftDto.closingBalance;
        const netAmount = closingBalance - shift.openingBalance;
        shift.endTime = new Date();
        shift.closingBalance = closingBalance;
        shift.netAmount = netAmount;
        shift.status = 'closed';
        if (endShiftDto.notes) {
            shift.notes = endShiftDto.notes;
        }
        return shift.save();
    }
    async getCurrentShift(cashierId) {
        return this.shiftModel.findOne({
            cashierId: new mongoose_2.Types.ObjectId(cashierId),
            status: 'active'
        }).populate('cashierId', 'name email').populate('outletId', 'name address');
    }
    async getShiftById(shiftId, cashierId) {
        const shift = await this.shiftModel.findOne({
            _id: new mongoose_2.Types.ObjectId(shiftId),
            cashierId: new mongoose_2.Types.ObjectId(cashierId)
        }).populate('cashierId', 'name email').populate('outletId', 'name address');
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        return shift;
    }
    async getDailyShifts(outletId, date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        return this.shiftModel.find({
            outletId: new mongoose_2.Types.ObjectId(outletId),
            startTime: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('cashierId', 'name email').sort({ startTime: -1 });
    }
    async getShiftReport(shiftId, cashierId) {
        const shift = await this.getShiftById(shiftId, cashierId);
        const expenses = await this.expenseModel.find({
            shiftId: new mongoose_2.Types.ObjectId(shiftId)
        }).sort({ createdAt: -1 });
        return {
            shift,
            expenses,
            summary: {
                totalSales: shift.totalSales,
                totalExpenses: shift.totalExpenses,
                netAmount: shift.netAmount,
                openingBalance: shift.openingBalance,
                closingBalance: shift.closingBalance,
                duration: shift.endTime
                    ? Math.floor((shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))
                    : Math.floor((new Date().getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))
            }
        };
    }
    async addExpense(shiftId, createExpenseDto, cashierId) {
        const shift = await this.shiftModel.findOne({
            _id: new mongoose_2.Types.ObjectId(shiftId),
            cashierId: new mongoose_2.Types.ObjectId(cashierId),
            status: 'active'
        });
        if (!shift) {
            throw new common_1.NotFoundException('Active shift not found');
        }
        const expense = new this.expenseModel({
            ...createExpenseDto,
            shiftId: new mongoose_2.Types.ObjectId(shiftId),
            addedBy: new mongoose_2.Types.ObjectId(cashierId)
        });
        const savedExpense = await expense.save();
        shift.totalExpenses += createExpenseDto.amount;
        shift.netAmount = shift.openingBalance + shift.totalSales - shift.totalExpenses;
        await shift.save();
        return savedExpense;
    }
    async getShiftExpenses(shiftId, cashierId) {
        const shift = await this.shiftModel.findOne({
            _id: new mongoose_2.Types.ObjectId(shiftId),
            cashierId: new mongoose_2.Types.ObjectId(cashierId)
        });
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        return this.expenseModel.find({
            shiftId: new mongoose_2.Types.ObjectId(shiftId)
        }).sort({ createdAt: -1 });
    }
    async updateShiftSales(shiftId, saleAmount) {
        const shift = await this.shiftModel.findById(shiftId);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        shift.totalSales += saleAmount;
        shift.netAmount = shift.openingBalance + shift.totalSales - shift.totalExpenses;
        return shift.save();
    }
    async getDailySummary(outletId, date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const shifts = await this.shiftModel.find({
            outletId: new mongoose_2.Types.ObjectId(outletId),
            startTime: {
                $gte: startDate,
                $lte: endDate
            }
        });
        const summary = shifts.reduce((acc, shift) => {
            acc.totalSales += shift.totalSales;
            acc.totalExpenses += shift.totalExpenses;
            acc.netAmount += shift.netAmount;
            acc.shiftCount += 1;
            return acc;
        }, {
            totalSales: 0,
            totalExpenses: 0,
            netAmount: 0,
            shiftCount: 0
        });
        return {
            date,
            ...summary,
            shifts: shifts.map(shift => ({
                id: shift._id,
                cashierId: shift.cashierId,
                startTime: shift.startTime,
                endTime: shift.endTime,
                status: shift.status,
                totalSales: shift.totalSales,
                totalExpenses: shift.totalExpenses,
                netAmount: shift.netAmount
            }))
        };
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_schema_1.Shift.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map