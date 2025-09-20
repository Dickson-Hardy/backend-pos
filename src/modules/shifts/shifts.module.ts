import { Module } from "@nestjs/common"
import { ShiftsController } from "./shifts.controller"

@Module({
  controllers: [ShiftsController],
  providers: [],
  exports: [],
})
export class ShiftsModule {}