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
exports.UpdatePackVariantDto = exports.CreatePackVariantDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePackVariantDto {
}
exports.CreatePackVariantDto = CreatePackVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: "Number of units in this pack" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePackVariantDto.prototype, "packSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3000, description: "Price for the entire pack" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePackVariantDto.prototype, "packPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: "Price per individual unit in this pack" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePackVariantDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Whether this pack variant is active" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePackVariantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "3-pack", description: "Optional name for the pack variant", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePackVariantDto.prototype, "name", void 0);
class UpdatePackVariantDto {
}
exports.UpdatePackVariantDto = UpdatePackVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: "Number of units in this pack", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePackVariantDto.prototype, "packSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3000, description: "Price for the entire pack", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePackVariantDto.prototype, "packPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: "Price per individual unit in this pack", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePackVariantDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Whether this pack variant is active", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePackVariantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "3-pack", description: "Optional name for the pack variant", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePackVariantDto.prototype, "name", void 0);
//# sourceMappingURL=pack-variant.dto.js.map