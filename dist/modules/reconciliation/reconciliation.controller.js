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
exports.ReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const reconciliation_service_1 = require("./reconciliation.service");
const reconciliation_schema_1 = require("../../schemas/reconciliation.schema");
let ReconciliationController = class ReconciliationController {
    constructor(reconciliationService) {
        this.reconciliationService = reconciliationService;
    }
    startDailyCashReconciliation(body, req) {
        return this.reconciliationService.startDailyCashReconciliation({
            outletId: body.outletId,
            performedBy: req.user.userId,
            reconciliationDate: new Date(body.reconciliationDate),
            startingCash: body.startingCash
        });
    }
    submitCashCount(id, body, req) {
        return this.reconciliationService.submitCashCount(id, body, req.user.userId);
    }
    createShiftReconciliation(body, req) {
        return this.reconciliationService.createShiftReconciliation({
            outletId: body.outletId,
            performedBy: req.user.userId,
            shiftStart: new Date(body.shiftStart),
            shiftEnd: new Date(body.shiftEnd),
            startingCash: body.startingCash
        });
    }
    createBankReconciliation(body, req) {
        return this.reconciliationService.createBankReconciliation({
            outletId: body.outletId,
            performedBy: req.user.userId,
            statementDate: new Date(body.statementDate),
            statementBalance: body.statementBalance,
            bookBalance: body.bookBalance
        });
    }
    addBankReconciliationItem(id, body) {
        return this.reconciliationService.addBankReconciliationItem(id, {
            ...body,
            date: new Date(body.date)
        });
    }
    createInventoryReconciliation(body, req) {
        return this.reconciliationService.createInventoryReconciliation({
            outletId: body.outletId,
            performedBy: req.user.userId,
            productIds: body.productIds
        });
    }
    updateInventoryCount(id, body) {
        return this.reconciliationService.updateInventoryCount(id, body.updates);
    }
    findAll(outletId, type, status, startDate, endDate) {
        const filters = {};
        if (outletId)
            filters.outletId = outletId;
        if (type)
            filters.type = type;
        if (status)
            filters.status = status;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        return this.reconciliationService.findAll(filters);
    }
    getReconciliationSummary(outletId, startDate, endDate) {
        if (!outletId || !startDate || !endDate) {
            throw new common_1.BadRequestException('outletId, startDate, and endDate are required');
        }
        return this.reconciliationService.getReconciliationSummary(outletId, new Date(startDate), new Date(endDate));
    }
    findOne(id) {
        return this.reconciliationService.findOne(id);
    }
    approveReconciliation(id, body, req) {
        return this.reconciliationService.approveReconciliation(id, req.user.userId, body.notes);
    }
    async getSignificantVariances(outletId, days = '30') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const filters = {
            startDate,
            endDate: new Date()
        };
        if (outletId)
            filters.outletId = outletId;
        const reconciliations = await this.reconciliationService.findAll(filters);
        return reconciliations.filter(recon => recon.hasSignificantVariance);
    }
    getPendingReconciliations(outletId) {
        const filters = {
            status: reconciliation_schema_1.ReconciliationStatus.COMPLETED
        };
        if (outletId)
            filters.outletId = outletId;
        return this.reconciliationService.findAll(filters);
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, common_1.Post)('daily-cash/start'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "startDailyCashReconciliation", null);
__decorate([
    (0, common_1.Patch)(':id/cash-count'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "submitCashCount", null);
__decorate([
    (0, common_1.Post)('shift/start'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "createShiftReconciliation", null);
__decorate([
    (0, common_1.Post)('bank/start'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "createBankReconciliation", null);
__decorate([
    (0, common_1.Patch)(':id/bank-item'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "addBankReconciliationItem", null);
__decorate([
    (0, common_1.Post)('inventory/start'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "createInventoryReconciliation", null);
__decorate([
    (0, common_1.Patch)(':id/inventory-count'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "updateInventoryCount", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('outletId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('outletId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "getReconciliationSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "approveReconciliation", null);
__decorate([
    (0, common_1.Get)('variances/significant'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('outletId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReconciliationController.prototype, "getSignificantVariances", null);
__decorate([
    (0, common_1.Get)('pending/all'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('outletId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "getPendingReconciliations", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, common_1.Controller)('reconciliation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map