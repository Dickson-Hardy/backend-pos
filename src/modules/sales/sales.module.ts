import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SalesController } from "./sales.controller"
import { SalesService } from "./sales.service"
import { Sale, SaleSchema } from "../../schemas/sale.schema"
import { PackVariant, PackVariantSchema } from "../../schemas/pack-variant.schema"
import { ProductsModule } from "../products/products.module"
import { ShiftsModule } from "../shifts/shifts.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: PackVariant.name, schema: PackVariantSchema },
    ]), 
    ProductsModule,
    forwardRef(() => ShiftsModule)
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
