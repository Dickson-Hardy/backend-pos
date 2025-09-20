import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  BadRequestException 
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ThermalPrinterNodeService } from './thermal-printer-node.service'

@Controller('thermal-printer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ThermalPrinterController {
  constructor(private readonly thermalPrinterService: ThermalPrinterNodeService) {}

  @Get('scan/usb')
  @Roles('admin', 'manager')
  async scanUSBPrinters() {
    try {
      return await this.thermalPrinterService.scanUSBPrinters()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('scan/serial')
  @Roles('admin', 'manager')
  async scanSerialPrinters() {
    try {
      return await this.thermalPrinterService.scanSerialPrinters()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('connect/serial')
  @Roles('admin', 'manager')
  async connectSerial(@Body() deviceData: {
    id: string
    path: string
    baudRate: number
  }) {
    try {
      await this.thermalPrinterService.connectSerial({
        id: deviceData.id,
        name: `Serial Printer (${deviceData.path})`,
        path: deviceData.path,
        baudRate: deviceData.baudRate,
        status: 'disconnected'
      })
      
      return { message: 'Connected successfully', deviceId: deviceData.id }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('disconnect/:deviceId')
  @Roles('admin', 'manager')
  async disconnect(@Param('deviceId') deviceId: string) {
    try {
      await this.thermalPrinterService.disconnect(deviceId)
      return { message: 'Disconnected successfully' }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('print/text/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async printText(
    @Param('deviceId') deviceId: string,
    @Body() printData: {
      text: string
      align?: 'left' | 'center' | 'right'
      bold?: boolean
      underline?: boolean
      fontSize?: 'normal' | 'large'
      lineFeed?: number
    }
  ) {
    try {
      const job = await this.thermalPrinterService.printText(deviceId, printData.text, {
        align: printData.align,
        bold: printData.bold,
        underline: printData.underline,
        fontSize: printData.fontSize,
        lineFeed: printData.lineFeed
      })
      
      return job
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('print/raw/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async printRaw(
    @Param('deviceId') deviceId: string,
    @Body() printData: {
      data: number[] // Raw byte array
    }
  ) {
    try {
      const buffer = Buffer.from(printData.data)
      const job = await this.thermalPrinterService.printRaw(deviceId, buffer)
      return job
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('cut/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async cutPaper(@Param('deviceId') deviceId: string) {
    try {
      await this.thermalPrinterService.cutPaper(deviceId)
      return { message: 'Paper cut command sent' }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('drawer/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async openDrawer(@Param('deviceId') deviceId: string) {
    try {
      await this.thermalPrinterService.openDrawer(deviceId)
      return { message: 'Cash drawer open command sent' }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Post('test/:deviceId')
  @Roles('admin', 'manager')
  async testPrint(@Param('deviceId') deviceId: string) {
    try {
      const job = await this.thermalPrinterService.testPrint(deviceId)
      return job
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('status/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async getPrinterStatus(@Param('deviceId') deviceId: string) {
    try {
      return await this.thermalPrinterService.getPrinterStatus(deviceId)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('connected')
  @Roles('admin', 'manager', 'cashier')
  async getConnectedPrinters() {
    return {
      printers: this.thermalPrinterService.getConnectedPrinters()
    }
  }

  @Get('connected/:deviceId')
  @Roles('admin', 'manager', 'cashier')
  async isConnected(@Param('deviceId') deviceId: string) {
    return {
      connected: this.thermalPrinterService.isConnected(deviceId)
    }
  }
}