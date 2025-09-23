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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shifts_service_1 = require("./shifts.service");
const create_shift_dto_1 = require("./dto/create-shift.dto");
const end_shift_dto_1 = require("./dto/end-shift.dto");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ShiftsController = class ShiftsController {
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    createShift(createShiftDto, req) {
        const { outletId } = req.user;
        return this.shiftsService.createShift(createShiftDto, req.user.id, outletId);
    }
    getCurrentShift(req) {
        return this.shiftsService.getCurrentShift(req.user.id);
    }
    getDailyShifts(date, req) {
        const { outletId } = req.user;
        return this.shiftsService.getDailyShifts(outletId, date);
    }
    getDailySummary(date, req) {
        const { outletId } = req.user;
        return this.shiftsService.getDailySummary(outletId, date);
    }
    getShiftById(id, req) {
        return this.shiftsService.getShiftById(id, req.user.id);
    }
    getShiftReport(id, req) {
        return this.shiftsService.getShiftReport(id, req.user.id);
    }
    endShift(id, endShiftDto, req) {
        return this.shiftsService.endShift(id, endShiftDto, req.user.id);
    }
    addExpense(id, createExpenseDto, req) {
        return this.shiftsService.addExpense(id, createExpenseDto, req.user.id);
    }
    getShiftExpenses(id, req) {
        return this.shiftsService.getShiftExpenses(id, req.user.id);
    }
    getStats() {
        return this.shiftsService.getStats();
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new shift' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shift_dto_1.CreateShiftDto, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "createShift", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active shift' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getCurrentShift", null);
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily shifts for outlet' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getDailyShifts", null);
__decorate([
    (0, common_1.Get)('daily/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily shift summary' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shift by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getShiftById", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed shift report' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getShiftReport", null);
__decorate([
    (0, common_1.Put)(':id/end'),
    (0, swagger_1.ApiOperation)({ summary: 'End a shift' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, end_shift_dto_1.EndShiftDto, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "endShift", null);
__decorate([
    (0, common_1.Post)(':id/expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add expense to shift' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "addExpense", null);
__decorate([
    (0, common_1.Get)(':id/expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shift expenses' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getShiftExpenses", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shift statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getStats", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, swagger_1.ApiTags)('shifts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('shifts'),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map