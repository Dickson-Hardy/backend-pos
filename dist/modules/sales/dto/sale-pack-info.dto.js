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
exports.CreateSalePackInfoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sale_pack_info_schema_1 = require("../../../schemas/sale-pack-info.schema");
class CreateSalePackInfoDto {
}
exports.CreateSalePackInfoDto = CreateSalePackInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sale_pack_info_schema_1.SaleType, example: sale_pack_info_schema_1.SaleType.PACK }),
    (0, class_validator_1.IsEnum)(sale_pack_info_schema_1.SaleType),
    __metadata("design:type", String)
], CreateSalePackInfoDto.prototype, "saleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "64f1234567890abcdef12345", description: "Pack variant ID (if pack sale)", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalePackInfoDto.prototype, "packVariantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: "Number of packs sold", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSalePackInfoDto.prototype, "packQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "Number of individual units sold", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSalePackInfoDto.prototype, "unitQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6, description: "Total units for inventory deduction" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSalePackInfoDto.prototype, "effectiveUnitCount", void 0);
//# sourceMappingURL=sale-pack-info.dto.js.map