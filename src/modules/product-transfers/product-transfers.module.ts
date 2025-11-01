import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProductTransfersController } from "./product-transfers.controller"
import { ProductTransfersService } from "./product-transfers.service"
import { ProductTransfer, ProductTransferSchema } from "../../schemas/product-transfer.schema"
import { Product, ProductSchema } from "../../schemas/product.schema"
import { WebsocketModule } from "../websocket/websocket.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductTransfer.name, schema: ProductTransferSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    WebsocketModule
  ],
  controllers: [ProductTransfersController],
  providers: [ProductTransfersService],
  exports: [ProductTransfersService]
})
export class ProductTransfersModule {}
