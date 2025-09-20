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
exports.UpdatePurchaseOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const create_purchase_order_dto_1 = require("./create-purchase-order.dto");
const purchase_order_schema_1 = require("../../../schemas/purchase-order.schema");
class UpdatePurchaseOrderDto extends (0, swagger_1.PartialType)(create_purchase_order_dto_1.CreatePurchaseOrderDto) {
}
exports.UpdatePurchaseOrderDto = UpdatePurchaseOrderDto;
__decorate([
    (0, swagger_2.ApiProperty)({ enum: purchase_order_schema_1.PurchaseOrderStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(purchase_order_schema_1.PurchaseOrderStatus),
    __metadata("design:type", String)
], UpdatePurchaseOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePurchaseOrderDto.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePurchaseOrderDto.prototype, "approvedBy", void 0);
//# sourceMappingURL=update-purchase-order.dto.js.map