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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedInventoryDto = exports.PackInventoryBreakdownDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PackInventoryBreakdownDto {
}
exports.PackInventoryBreakdownDto = PackInventoryBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Function)
], PackInventoryBreakdownDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PackInventoryBreakdownDto.prototype, "availablePacks", void 0);
class EnhancedInventoryDto {
}
exports.EnhancedInventoryDto = EnhancedInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnhancedInventoryDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnhancedInventoryDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EnhancedInventoryDto.prototype, "totalUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PackInventoryBreakdownDto] }),
    __metadata("design:type", Array)
], EnhancedInventoryDto.prototype, "packBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EnhancedInventoryDto.prototype, "looseUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EnhancedInventoryDto.prototype, "totalValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnhancedInventoryDto.prototype, "formattedDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EnhancedInventoryDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EnhancedInventoryDto.prototype, "maxStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], EnhancedInventoryDto.prototype, "needsReorder", void 0);
//# sourceMappingURL=enhanced-inventory.dto.js.map