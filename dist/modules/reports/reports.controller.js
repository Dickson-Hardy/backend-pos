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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getSalesReport(outletId, startDate, endDate) {
        return this.reportsService.getSalesReport(outletId, new Date(startDate), new Date(endDate));
    }
    async getWeeklySales(outletId) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        return this.reportsService.getSalesReport(outletId, startDate, endDate);
    }
    async getInventoryReport(outletId) {
        return this.reportsService.getInventoryReport(outletId);
    }
    async getStaffPerformance(outletId, startDate, endDate) {
        return this.reportsService.getStaffPerformance(outletId, new Date(startDate), new Date(endDate));
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)("sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get sales report" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: true }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: true }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)("sales/weekly"),
    (0, swagger_1.ApiOperation)({ summary: "Get weekly sales report" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWeeklySales", null);
__decorate([
    (0, common_1.Get)("inventory"),
    (0, swagger_1.ApiOperation)({ summary: "Get inventory report" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)("staff-performance"),
    (0, swagger_1.ApiOperation)({ summary: "Get staff performance report" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: true }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: true }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStaffPerformance", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)("reports"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("reports"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map