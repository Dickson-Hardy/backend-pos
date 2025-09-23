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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    create(createSaleDto) {
        return this.salesService.create(createSaleDto);
    }
    findAll(outletId, startDate, endDate, cashierId, status) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.salesService.findAll(outletId, start, end, cashierId, status);
    }
    getDailySales(outletId) {
        return this.salesService.getDailySales(outletId);
    }
    findOne(id) {
        return this.salesService.findOne(id);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new sale" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all sales" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: false }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: false }),
    (0, swagger_1.ApiQuery)({ name: "cashierId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __param(3, (0, common_1.Query)("cashierId")),
    __param(4, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("daily"),
    (0, swagger_1.ApiOperation)({ summary: "Get daily sales summary" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getDailySales", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get sale by ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)("sales"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("sales"),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map