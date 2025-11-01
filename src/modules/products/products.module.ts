import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"
import { Product, ProductSchema } from "../../schemas/product.schema"
import { Batch, BatchSchema } from "../../schemas/batch.schema"
import { PackVariant, PackVariantSchema } from "../../schemas/pack-variant.schema"
import { WebsocketModule } from "../websocket/websocket.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: PackVariant.name, schema: PackVariantSchema },
    ]),
    WebsocketModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
