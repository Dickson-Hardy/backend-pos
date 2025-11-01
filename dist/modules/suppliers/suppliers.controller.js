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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const suppliers_service_1 = require("./suppliers.service");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
const update_supplier_dto_1 = require("./dto/update-supplier.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SuppliersController = class SuppliersController {
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    create(createSupplierDto) {
        return this.suppliersService.create(createSupplierDto);
    }
    findAll(outletId, status) {
        return this.suppliersService.findAll(outletId, status);
    }
    getStats(outletId) {
        return this.suppliersService.getSupplierStats(outletId);
    }
    findOne(id) {
        return this.suppliersService.findOne(id);
    }
    update(id, updateSupplierDto) {
        return this.suppliersService.update(id, updateSupplierDto);
    }
    updateFull(id, updateSupplierDto) {
        return this.suppliersService.update(id, updateSupplierDto);
    }
    remove(id) {
        return this.suppliersService.remove(id);
    }
    updateRating(id, body) {
        return this.suppliersService.updateRating(id, body.rating);
    }
    updateLastOrder(id, body) {
        return this.suppliersService.updateLastOrder(id, new Date(body.orderDate));
    }
    incrementProductsSupplied(id, body) {
        return this.suppliersService.incrementProductsSupplied(id, body.count || 1);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new supplier" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Supplier created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Supplier with this name already exists" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all suppliers" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false, description: "Filter by outlet ID" }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false, description: "Filter by status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of suppliers" }),
    __param(0, (0, common_1.Query)("outletId")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get supplier statistics" }),
    (0, swagger_1.ApiQuery)({ name: "outletId", required: false, description: "Filter by outlet ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Supplier statistics" }),
    __param(0, (0, common_1.Query)("outletId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a supplier by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Supplier details" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a supplier (partial)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Supplier updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Supplier with this name already exists" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a supplier (full)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Supplier updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Supplier with this name already exists" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "updateFull", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a supplier" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Supplier deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(":id/rating"),
    (0, swagger_1.ApiOperation)({ summary: "Update supplier rating" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Rating updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "updateRating", null);
__decorate([
    (0, common_1.Patch)(":id/last-order"),
    (0, swagger_1.ApiOperation)({ summary: "Update supplier last order date" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Last order date updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "updateLastOrder", null);
__decorate([
    (0, common_1.Patch)(":id/products-supplied"),
    (0, swagger_1.ApiOperation)({ summary: "Increment products supplied count" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Supplier ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Products supplied count updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Supplier not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "incrementProductsSupplied", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, swagger_1.ApiTags)("suppliers"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("suppliers"),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map