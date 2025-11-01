import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReturnsController } from "./returns.controller"
import { ReturnsService } from "./returns.service"
import { Return, ReturnSchema } from "../../schemas/return.schema"
import { Product, ProductSchema } from "../../schemas/product.schema"
import { WebsocketModule } from "../websocket/websocket.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Return.name, schema: ReturnSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    WebsocketModule
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService]
})
export class ReturnsModule {}
