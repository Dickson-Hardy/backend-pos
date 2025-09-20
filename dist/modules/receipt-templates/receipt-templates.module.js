"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const receipt_templates_service_1 = require("./receipt-templates.service");
const receipt_templates_controller_1 = require("./receipt-templates.controller");
const receipt_template_schema_1 = require("../../schemas/receipt-template.schema");
let ReceiptTemplatesModule = class ReceiptTemplatesModule {
};
exports.ReceiptTemplatesModule = ReceiptTemplatesModule;
exports.ReceiptTemplatesModule = ReceiptTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: receipt_template_schema_1.ReceiptTemplate.name, schema: receipt_template_schema_1.ReceiptTemplateSchema }
            ])
        ],
        controllers: [receipt_templates_controller_1.ReceiptTemplatesController],
        providers: [receipt_templates_service_1.ReceiptTemplatesService],
        exports: [receipt_templates_service_1.ReceiptTemplatesService],
    })
], ReceiptTemplatesModule);
//# sourceMappingURL=receipt-templates.module.js.map