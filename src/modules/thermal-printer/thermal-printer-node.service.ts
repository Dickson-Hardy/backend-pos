import { Injectable } from '@nestjs/common'
import { SerialPort } from 'serialport'
import * as usb from 'usb'

export interface USBPrinterDevice {
  id: string
  name: string
  vendorId: number
  productId: number
  path?: string
  serialNumber?: string
  manufacturer?: string
  status: 'connected' | 'disconnected' | 'error'
}

export interface SerialPrinterDevice {
  id: string
  name: string
  path: string
  baudRate: number
  status: 'connected' | 'disconnected' | 'error'
}

export interface NodePrintJob {
  id: string
  data: Buffer
  status: 'pending' | 'printing' | 'completed' | 'failed'
  error?: string
  startTime?: Date
  endTime?: Date
}

@Injectable()
export class ThermalPrinterNodeService {
  private connectedPrinters: Map<string, SerialPort> = new Map()
  
  // Common thermal printer USB vendor/product IDs
  private readonly THERMAL_PRINTER_IDS = [
    { vendorId: 0x0416, productId: 0x5011, name: 'XPrinter' }, // XPrinter
    { vendorId: 0x04b8, productId: 0x0202, name: 'Epson TM' }, // Epson TM series
    { vendorId: 0x04b8, productId: 0x0e15, name: 'Epson TM-T20' },
    { vendorId: 0x0fe6, productId: 0x811e, name: 'Citizen CBM' }, // Citizen
    { vendorId: 0x1fc9, productId: 0x2016, name: 'Star TSP' }, // Star Micronics
    { vendorId: 0x154f, productId: 0x154f, name: 'Thermal Printer' }, // Generic
  ]

  /**
   * Scan for available USB thermal printers
   */
  async scanUSBPrinters(): Promise<USBPrinterDevice[]> {
    try {
      const devices = usb.getDeviceList()
      const thermalPrinters: USBPrinterDevice[] = []

      for (const device of devices) {
        const descriptor = device.deviceDescriptor
        
        // Check if device matches known thermal printer IDs
        const printerInfo = this.THERMAL_PRINTER_IDS.find(
          p => p.vendorId === descriptor.idVendor && p.productId === descriptor.idProduct
        )
        
        if (printerInfo) {
          try {
            device.open()
            
            let manufacturer = 'Unknown'
            let product = 'Unknown'
            let serialNumber = 'Unknown'
            
            try {
              if (descriptor.iManufacturer) {
                manufacturer = await this.getStringDescriptor(device, descriptor.iManufacturer)
              }
              if (descriptor.iProduct) {
                product = await this.getStringDescriptor(device, descriptor.iProduct)
              }
              if (descriptor.iSerialNumber) {
                serialNumber = await this.getStringDescriptor(device, descriptor.iSerialNumber)
              }
            } catch (descriptorError) {
              console.log('Failed to read device descriptors:', descriptorError.message)
            }
            
            device.close()
            
            thermalPrinters.push({
              id: `usb_${descriptor.idVendor}_${descriptor.idProduct}_${serialNumber}`,
              name: `${manufacturer} ${product}`,
              vendorId: descriptor.idVendor,
              productId: descriptor.idProduct,
              serialNumber,
              manufacturer,
              status: 'disconnected'
            })
          } catch (error) {
            console.log(`Failed to open USB device: ${error.message}`)
          }
        }
      }

      return thermalPrinters
    } catch (error) {
      console.error('Failed to scan USB printers:', error)
      throw new Error('Failed to scan for USB thermal printers')
    }
  }

  /**
   * Scan for available serial port printers
   */
  async scanSerialPrinters(): Promise<SerialPrinterDevice[]> {
    try {
      const ports = await SerialPort.list()
      const thermalPrinters: SerialPrinterDevice[] = []

      for (const port of ports) {
        // Filter for likely thermal printer serial ports
        if (this.isLikelyThermalPrinter(port)) {
          thermalPrinters.push({
            id: `serial_${port.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: `${port.manufacturer || 'Unknown'} (${port.path})`,
            path: port.path,
            baudRate: 9600, // Default baud rate for thermal printers
            status: 'disconnected'
          })
        }
      }

      return thermalPrinters
    } catch (error) {
      console.error('Failed to scan serial printers:', error)
      throw new Error('Failed to scan for serial thermal printers')
    }
  }

  /**
   * Connect to a thermal printer via serial port
   */
  async connectSerial(device: SerialPrinterDevice): Promise<void> {
    try {
      if (this.connectedPrinters.has(device.id)) {
        throw new Error('Printer already connected')
      }

      const serialPort = new SerialPort({
        path: device.path,
        baudRate: device.baudRate,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        autoOpen: false
      })

      return new Promise((resolve, reject) => {
        serialPort.open((error) => {
          if (error) {
            reject(new Error(`Failed to connect to printer: ${error.message}`))
            return
          }

          this.connectedPrinters.set(device.id, serialPort)
          
          // Set up error handling
          serialPort.on('error', (err) => {
            console.error(`Printer error: ${err.message}`)
            this.connectedPrinters.delete(device.id)
          })

          resolve()
        })
      })
    } catch (error) {
      throw new Error(`Failed to connect to thermal printer: ${error.message}`)
    }
  }

  /**
   * Disconnect from a thermal printer
   */
  async disconnect(deviceId: string): Promise<void> {
    const serialPort = this.connectedPrinters.get(deviceId)
    
    if (!serialPort) {
      throw new Error('Printer not connected')
    }

    return new Promise((resolve, reject) => {
      serialPort.close((error) => {
        if (error) {
          reject(new Error(`Failed to disconnect: ${error.message}`))
          return
        }

        this.connectedPrinters.delete(deviceId)
        resolve()
      })
    })
  }

  /**
   * Print raw data to thermal printer
   */
  async printRaw(deviceId: string, data: Buffer): Promise<NodePrintJob> {
    const serialPort = this.connectedPrinters.get(deviceId)
    
    if (!serialPort) {
      throw new Error('Printer not connected')
    }

    const jobId = this.generateJobId()
    const printJob: NodePrintJob = {
      id: jobId,
      data,
      status: 'pending',
      startTime: new Date()
    }

    try {
      printJob.status = 'printing'

      return new Promise((resolve, reject) => {
        serialPort.write(data, (error) => {
          if (error) {
            printJob.status = 'failed'
            printJob.error = error.message
            printJob.endTime = new Date()
            reject(new Error(`Print failed: ${error.message}`))
            return
          }

          // Wait for data to be transmitted
          serialPort.drain((drainError) => {
            printJob.endTime = new Date()
            
            if (drainError) {
              printJob.status = 'failed'
              printJob.error = drainError.message
              reject(new Error(`Print failed: ${drainError.message}`))
              return
            }

            printJob.status = 'completed'
            resolve(printJob)
          })
        })
      })
    } catch (error) {
      printJob.status = 'failed'
      printJob.error = error.message
      printJob.endTime = new Date()
      throw error
    }
  }

  /**
   * Print text with basic formatting
   */
  async printText(deviceId: string, text: string, options: {
    align?: 'left' | 'center' | 'right'
    bold?: boolean
    underline?: boolean
    fontSize?: 'normal' | 'large'
    lineFeed?: number
  } = {}): Promise<NodePrintJob> {
    const commands: number[] = []
    
    // Initialize printer
    commands.push(0x1B, 0x40) // ESC @
    
    // Set alignment
    if (options.align === 'center') {
      commands.push(0x1B, 0x61, 0x01) // ESC a 1
    } else if (options.align === 'right') {
      commands.push(0x1B, 0x61, 0x02) // ESC a 2
    } else {
      commands.push(0x1B, 0x61, 0x00) // ESC a 0
    }
    
    // Set text style
    if (options.bold) {
      commands.push(0x1B, 0x45, 0x01) // ESC E 1
    }
    
    if (options.underline) {
      commands.push(0x1B, 0x2D, 0x01) // ESC - 1
    }
    
    if (options.fontSize === 'large') {
      commands.push(0x1B, 0x21, 0x11) // ESC ! 0x11
    }
    
    // Add text
    const textBytes = Buffer.from(text, 'utf8')
    commands.push(...Array.from(textBytes))
    
    // Reset formatting
    commands.push(0x1B, 0x21, 0x00) // ESC ! 0
    
    // Add line feeds
    const lineFeeds = options.lineFeed || 1
    for (let i = 0; i < lineFeeds; i++) {
      commands.push(0x0A) // LF
    }

    const buffer = Buffer.from(commands)
    return this.printRaw(deviceId, buffer)
  }

  /**
   * Cut paper
   */
  async cutPaper(deviceId: string): Promise<void> {
    const cutCommands = Buffer.from([0x1D, 0x56, 0x01]) // GS V 1
    await this.printRaw(deviceId, cutCommands)
  }

  /**
   * Open cash drawer (if connected)
   */
  async openDrawer(deviceId: string): Promise<void> {
    const drawerCommands = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]) // ESC p 0 25 250
    await this.printRaw(deviceId, drawerCommands)
  }

  /**
   * Test printer connection
   */
  async testPrint(deviceId: string): Promise<NodePrintJob> {
    const testText = 'Test Print\nPrinter Connected Successfully\n\n'
    return this.printText(deviceId, testText, { align: 'center' })
  }

  /**
   * Get printer status
   */
  async getPrinterStatus(deviceId: string): Promise<{
    connected: boolean
    paperStatus: 'ok' | 'low' | 'out' | 'unknown'
    error?: string
  }> {
    const serialPort = this.connectedPrinters.get(deviceId)
    
    if (!serialPort || !serialPort.isOpen) {
      return {
        connected: false,
        paperStatus: 'unknown',
        error: 'Printer not connected'
      }
    }

    // Send real-time status request
    const statusCommand = Buffer.from([0x10, 0x04, 0x01]) // DLE EOT 1
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          connected: true,
          paperStatus: 'unknown',
          error: 'Status request timeout'
        })
      }, 2000)

      serialPort.once('data', (data) => {
        clearTimeout(timeout)
        
        if (data.length > 0) {
          const status = data[0]
          const paperStatus = (status & 0x60) === 0x60 ? 'out' : 
                            (status & 0x0C) !== 0 ? 'low' : 'ok'
          
          resolve({
            connected: true,
            paperStatus,
            error: (status & 0x40) ? 'Cover open' : undefined
          })
        } else {
          resolve({
            connected: true,
            paperStatus: 'unknown'
          })
        }
      })

      serialPort.write(statusCommand)
    })
  }

  /**
   * Helper methods
   */
  private async getStringDescriptor(device: any, index: number): Promise<string> {
    return new Promise((resolve, reject) => {
      device.getStringDescriptor(index, (error: any, data: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(data || 'Unknown')
        }
      })
    })
  }

  private isLikelyThermalPrinter(port: any): boolean {
    const manufacturer = (port.manufacturer || '').toLowerCase()
    const vendorId = port.vendorId
    
    // Check for known thermal printer manufacturers
    const thermalManufacturers = ['xprinter', 'epson', 'citizen', 'star', 'bixolon', 'custom']
    
    if (thermalManufacturers.some(mfg => manufacturer.includes(mfg))) {
      return true
    }
    
    // Check for known vendor IDs
    const thermalVendorIds = ['0416', '04b8', '0fe6', '1fc9', '154f']
    
    if (vendorId && thermalVendorIds.includes(vendorId.toLowerCase())) {
      return true
    }
    
    // Check for USB-to-serial adapters commonly used with thermal printers
    const serialAdapters = ['ch340', 'ch341', 'cp210x', 'ftdi', 'pl2303']
    
    if (serialAdapters.some(adapter => manufacturer.includes(adapter))) {
      return true
    }
    
    return false
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get all connected printers
   */
  getConnectedPrinters(): string[] {
    return Array.from(this.connectedPrinters.keys())
  }

  /**
   * Check if printer is connected
   */
  isConnected(deviceId: string): boolean {
    const serialPort = this.connectedPrinters.get(deviceId)
    return serialPort ? serialPort.isOpen : false
  }
}