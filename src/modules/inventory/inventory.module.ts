import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { InventoryController } from "./inventory.controller"
import { InventoryService } from "./inventory.service"
import { InventoryAdjustment, InventoryAdjustmentSchema } from "../../schemas/inventory-adjustment.schema"
import { PackVariant, PackVariantSchema } from "../../schemas/pack-variant.schema"
import { ProductsModule } from "../products/products.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryAdjustment.name, schema: InventoryAdjustmentSchema },
      { name: PackVariant.name, schema: PackVariantSchema },
    ]),
    ProductsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
