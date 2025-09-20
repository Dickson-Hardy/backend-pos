import { Module } from '@nestjs/common'
import { ThermalPrinterController } from './thermal-printer.controller'
import { ThermalPrinterNodeService } from './thermal-printer-node.service'

@Module({
  controllers: [ThermalPrinterController],
  providers: [ThermalPrinterNodeService],
  exports: [ThermalPrinterNodeService],
})
export class ThermalPrinterModule {}