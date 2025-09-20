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
exports.CreateOutletDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateOutletDto {
}
exports.CreateOutletDto = CreateOutletDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Main Pharmacy Branch" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123 Main Street" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "New York" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NY" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "10001" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+1-555-0123" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "PH-2024-001" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutletDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateOutletDto.prototype, "operatingHours", void 0);
//# sourceMappingURL=create-outlet.dto.js.map