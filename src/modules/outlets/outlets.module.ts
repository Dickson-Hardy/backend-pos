import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OutletsController } from "./outlets.controller"
import { OutletsService } from "./outlets.service"
import { Outlet, OutletSchema } from "../../schemas/outlet.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Outlet.name, schema: OutletSchema }])],
  controllers: [OutletsController],
  providers: [OutletsService],
  exports: [OutletsService],
})
export class OutletsModule {}
