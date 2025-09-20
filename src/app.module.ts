import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { ProductsModule } from "./modules/products/products.module"
import { InventoryModule } from "./modules/inventory/inventory.module"
import { SalesModule } from "./modules/sales/sales.module"
import { OutletsModule } from "./modules/outlets/outlets.module"
import { ReportsModule } from "./modules/reports/reports.module"
import { UploadsModule } from "./modules/uploads/uploads.module"
import { EmailModule } from "./modules/email/email.module"
import { ShiftsModule } from "./modules/shifts/shifts.module"
import { PurchaseOrdersModule } from "./modules/purchase-orders/purchase-orders.module"
import { HealthModule } from "./modules/health/health.module"
import { ReceiptTemplatesModule } from "./modules/receipt-templates/receipt-templates.module"
import { ThermalPrinterModule } from "./modules/thermal-printer/thermal-printer.module"
import { ReconciliationModule } from "./modules/reconciliation/reconciliation.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/pharmacy_pos"),
    AuthModule,
    UsersModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    OutletsModule,
    ReportsModule,
    UploadsModule,
    EmailModule,
    ShiftsModule,
    PurchaseOrdersModule,
    HealthModule,
    ReceiptTemplatesModule,
    ThermalPrinterModule,
    ReconciliationModule,
  ],
})
export class AppModule {}
