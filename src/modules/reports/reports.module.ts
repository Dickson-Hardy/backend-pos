import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReportsService } from "./reports.service"
import { ReportsController } from "./reports.controller"
import { Sale, SaleSchema } from "../../schemas/sale.schema"
import { Product, ProductSchema } from "../../schemas/product.schema"
import { Batch, BatchSchema } from "../../schemas/batch.schema"
import { User, UserSchema } from "../../schemas/user.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
