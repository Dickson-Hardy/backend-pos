import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { InventoryController } from "./inventory.controller"
import { InventoryService } from "./inventory.service"
import { InventoryAdjustment, InventoryAdjustmentSchema } from "../../schemas/inventory-adjustment.schema"
import { ProductsModule } from "../products/products.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: InventoryAdjustment.name, schema: InventoryAdjustmentSchema }]),
    ProductsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
