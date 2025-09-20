"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const reconciliation_service_1 = require("./reconciliation.service");
const reconciliation_controller_1 = require("./reconciliation.controller");
const reconciliation_schema_1 = require("../../schemas/reconciliation.schema");
const sale_schema_1 = require("../../schemas/sale.schema");
const product_schema_1 = require("../../schemas/product.schema");
let ReconciliationModule = class ReconciliationModule {
};
exports.ReconciliationModule = ReconciliationModule;
exports.ReconciliationModule = ReconciliationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: reconciliation_schema_1.Reconciliation.name, schema: reconciliation_schema_1.ReconciliationSchema },
                { name: sale_schema_1.Sale.name, schema: sale_schema_1.SaleSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema }
            ])
        ],
        controllers: [reconciliation_controller_1.ReconciliationController],
        providers: [reconciliation_service_1.ReconciliationService],
        exports: [reconciliation_service_1.ReconciliationService],
    })
], ReconciliationModule);
//# sourceMappingURL=reconciliation.module.js.map