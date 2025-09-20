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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ShiftsController = class ShiftsController {
    findAll() {
        return [];
    }
    getStats() {
        return {
            totalShifts: 0,
            activeShifts: 0,
            averageShiftDuration: 0,
        };
    }
    start(data) {
        return {
            id: "shift-id",
            cashierId: data.cashierId,
            openingBalance: data.openingBalance,
            startTime: new Date(),
            status: "active",
        };
    }
    end(id, data) {
        return {
            id,
            closingBalance: data.closingBalance,
            endTime: new Date(),
            status: "completed",
        };
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all shifts" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get shift statistics" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)("start"),
    (0, swagger_1.ApiOperation)({ summary: "Start a new shift" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(":id/end"),
    (0, swagger_1.ApiOperation)({ summary: "End a shift" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "end", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, swagger_1.ApiTags)("shifts"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("shifts")
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map