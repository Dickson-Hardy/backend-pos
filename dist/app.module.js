"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const products_module_1 = require("./modules/products/products.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const sales_module_1 = require("./modules/sales/sales.module");
const outlets_module_1 = require("./modules/outlets/outlets.module");
const reports_module_1 = require("./modules/reports/reports.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const email_module_1 = require("./modules/email/email.module");
const shifts_module_1 = require("./modules/shifts/shifts.module");
const purchase_orders_module_1 = require("./modules/purchase-orders/purchase-orders.module");
const health_module_1 = require("./modules/health/health.module");
const receipt_templates_module_1 = require("./modules/receipt-templates/receipt-templates.module");
const thermal_printer_module_1 = require("./modules/thermal-printer/thermal-printer.module");
const reconciliation_module_1 = require("./modules/reconciliation/reconciliation.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const supplier_payments_module_1 = require("./modules/supplier-payments/supplier-payments.module");
const returns_module_1 = require("./modules/returns/returns.module");
const product_transfers_module_1 = require("./modules/product-transfers/product-transfers.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/pharmacy_pos"),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            inventory_module_1.InventoryModule,
            sales_module_1.SalesModule,
            outlets_module_1.OutletsModule,
            reports_module_1.ReportsModule,
            uploads_module_1.UploadsModule,
            email_module_1.EmailModule,
            shifts_module_1.ShiftsModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            health_module_1.HealthModule,
            receipt_templates_module_1.ReceiptTemplatesModule,
            thermal_printer_module_1.ThermalPrinterModule,
            reconciliation_module_1.ReconciliationModule,
            suppliers_module_1.SuppliersModule,
            supplier_payments_module_1.SupplierPaymentsModule,
            returns_module_1.ReturnsModule,
            product_transfers_module_1.ProductTransfersModule,
            websocket_module_1.WebsocketModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map