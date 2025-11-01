"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTransfersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_transfers_controller_1 = require("./product-transfers.controller");
const product_transfers_service_1 = require("./product-transfers.service");
const product_transfer_schema_1 = require("../../schemas/product-transfer.schema");
const product_schema_1 = require("../../schemas/product.schema");
const websocket_module_1 = require("../websocket/websocket.module");
let ProductTransfersModule = class ProductTransfersModule {
};
exports.ProductTransfersModule = ProductTransfersModule;
exports.ProductTransfersModule = ProductTransfersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_transfer_schema_1.ProductTransfer.name, schema: product_transfer_schema_1.ProductTransferSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema }
            ]),
            websocket_module_1.WebsocketModule
        ],
        controllers: [product_transfers_controller_1.ProductTransfersController],
        providers: [product_transfers_service_1.ProductTransfersService],
        exports: [product_transfers_service_1.ProductTransfersService]
    })
], ProductTransfersModule);
//# sourceMappingURL=product-transfers.module.js.map