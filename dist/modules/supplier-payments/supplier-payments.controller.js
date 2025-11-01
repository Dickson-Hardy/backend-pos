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
exports.SupplierPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const supplier_payments_service_1 = require("./supplier-payments.service");
const create_supplier_payment_dto_1 = require("./dto/create-supplier-payment.dto");
const record_payment_dto_1 = require("./dto/record-payment.dto");
let SupplierPaymentsController = class SupplierPaymentsController {
    constructor(service) {
        this.service = service;
    }
    create(createDto, req) {
        return this.service.create(createDto, req.user.userId);
    }
    recordPayment(id, recordDto, req) {
        return this.service.recordPayment(id, recordDto, req.user.userId);
    }
    findAll(outletId, status) {
        return this.service.findAll(outletId, status);
    }
    getOverdue(outletId) {
        return this.service.getOverduePayments(outletId);
    }
    getStats(outletId) {
        return this.service.getPaymentStats(outletId);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
};
exports.SupplierPaymentsController = SupplierPaymentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_payment_dto_1.CreateSupplierPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/record-payment"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_payment_dto_1.RecordPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("overdue"),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)("stats"),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplierPaymentsController.prototype, "findOne", null);
exports.SupplierPaymentsController = SupplierPaymentsController = __decorate([
    (0, common_1.Controller)("supplier-payments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [supplier_payments_service_1.SupplierPaymentsService])
], SupplierPaymentsController);
//# sourceMappingURL=supplier-payments.controller.js.map