"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermalPrinterNodeService = void 0;
const common_1 = require("@nestjs/common");
const serialport_1 = require("serialport");
const usb = require("usb");
let ThermalPrinterNodeService = class ThermalPrinterNodeService {
    constructor() {
        this.connectedPrinters = new Map();
        this.THERMAL_PRINTER_IDS = [
            { vendorId: 0x0416, productId: 0x5011, name: 'XPrinter' },
            { vendorId: 0x04b8, productId: 0x0202, name: 'Epson TM' },
            { vendorId: 0x04b8, productId: 0x0e15, name: 'Epson TM-T20' },
            { vendorId: 0x0fe6, productId: 0x811e, name: 'Citizen CBM' },
            { vendorId: 0x1fc9, productId: 0x2016, name: 'Star TSP' },
            { vendorId: 0x154f, productId: 0x154f, name: 'Thermal Printer' },
        ];
    }
    async scanUSBPrinters() {
        try {
            const devices = usb.getDeviceList();
            const thermalPrinters = [];
            for (const device of devices) {
                const descriptor = device.deviceDescriptor;
                const printerInfo = this.THERMAL_PRINTER_IDS.find(p => p.vendorId === descriptor.idVendor && p.productId === descriptor.idProduct);
                if (printerInfo) {
                    try {
                        device.open();
                        let manufacturer = 'Unknown';
                        let product = 'Unknown';
                        let serialNumber = 'Unknown';
                        try {
                            if (descriptor.iManufacturer) {
                                manufacturer = await this.getStringDescriptor(device, descriptor.iManufacturer);
                            }
                            if (descriptor.iProduct) {
                                product = await this.getStringDescriptor(device, descriptor.iProduct);
                            }
                            if (descriptor.iSerialNumber) {
                                serialNumber = await this.getStringDescriptor(device, descriptor.iSerialNumber);
                            }
                        }
                        catch (descriptorError) {
                            console.log('Failed to read device descriptors:', descriptorError.message);
                        }
                        device.close();
                        thermalPrinters.push({
                            id: `usb_${descriptor.idVendor}_${descriptor.idProduct}_${serialNumber}`,
                            name: `${manufacturer} ${product}`,
                            vendorId: descriptor.idVendor,
                            productId: descriptor.idProduct,
                            serialNumber,
                            manufacturer,
                            status: 'disconnected'
                        });
                    }
                    catch (error) {
                        console.log(`Failed to open USB device: ${error.message}`);
                    }
                }
            }
            return thermalPrinters;
        }
        catch (error) {
            console.error('Failed to scan USB printers:', error);
            throw new Error('Failed to scan for USB thermal printers');
        }
    }
    async scanSerialPrinters() {
        try {
            const ports = await serialport_1.SerialPort.list();
            const thermalPrinters = [];
            for (const port of ports) {
                if (this.isLikelyThermalPrinter(port)) {
                    thermalPrinters.push({
                        id: `serial_${port.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
                        name: `${port.manufacturer || 'Unknown'} (${port.path})`,
                        path: port.path,
                        baudRate: 9600,
                        status: 'disconnected'
                    });
                }
            }
            return thermalPrinters;
        }
        catch (error) {
            console.error('Failed to scan serial printers:', error);
            throw new Error('Failed to scan for serial thermal printers');
        }
    }
    async connectSerial(device) {
        try {
            if (this.connectedPrinters.has(device.id)) {
                throw new Error('Printer already connected');
            }
            const serialPort = new serialport_1.SerialPort({
                path: device.path,
                baudRate: device.baudRate,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                autoOpen: false
            });
            return new Promise((resolve, reject) => {
                serialPort.open((error) => {
                    if (error) {
                        reject(new Error(`Failed to connect to printer: ${error.message}`));
                        return;
                    }
                    this.connectedPrinters.set(device.id, serialPort);
                    serialPort.on('error', (err) => {
                        console.error(`Printer error: ${err.message}`);
                        this.connectedPrinters.delete(device.id);
                    });
                    resolve();
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to connect to thermal printer: ${error.message}`);
        }
    }
    async disconnect(deviceId) {
        const serialPort = this.connectedPrinters.get(deviceId);
        if (!serialPort) {
            throw new Error('Printer not connected');
        }
        return new Promise((resolve, reject) => {
            serialPort.close((error) => {
                if (error) {
                    reject(new Error(`Failed to disconnect: ${error.message}`));
                    return;
                }
                this.connectedPrinters.delete(deviceId);
                resolve();
            });
        });
    }
    async printRaw(deviceId, data) {
        const serialPort = this.connectedPrinters.get(deviceId);
        if (!serialPort) {
            throw new Error('Printer not connected');
        }
        const jobId = this.generateJobId();
        const printJob = {
            id: jobId,
            data,
            status: 'pending',
            startTime: new Date()
        };
        try {
            printJob.status = 'printing';
            return new Promise((resolve, reject) => {
                serialPort.write(data, (error) => {
                    if (error) {
                        printJob.status = 'failed';
                        printJob.error = error.message;
                        printJob.endTime = new Date();
                        reject(new Error(`Print failed: ${error.message}`));
                        return;
                    }
                    serialPort.drain((drainError) => {
                        printJob.endTime = new Date();
                        if (drainError) {
                            printJob.status = 'failed';
                            printJob.error = drainError.message;
                            reject(new Error(`Print failed: ${drainError.message}`));
                            return;
                        }
                        printJob.status = 'completed';
                        resolve(printJob);
                    });
                });
            });
        }
        catch (error) {
            printJob.status = 'failed';
            printJob.error = error.message;
            printJob.endTime = new Date();
            throw error;
        }
    }
    async printText(deviceId, text, options = {}) {
        const commands = [];
        commands.push(0x1B, 0x40);
        if (options.align === 'center') {
            commands.push(0x1B, 0x61, 0x01);
        }
        else if (options.align === 'right') {
            commands.push(0x1B, 0x61, 0x02);
        }
        else {
            commands.push(0x1B, 0x61, 0x00);
        }
        if (options.bold) {
            commands.push(0x1B, 0x45, 0x01);
        }
        if (options.underline) {
            commands.push(0x1B, 0x2D, 0x01);
        }
        if (options.fontSize === 'large') {
            commands.push(0x1B, 0x21, 0x11);
        }
        const textBytes = Buffer.from(text, 'utf8');
        commands.push(...Array.from(textBytes));
        commands.push(0x1B, 0x21, 0x00);
        const lineFeeds = options.lineFeed || 1;
        for (let i = 0; i < lineFeeds; i++) {
            commands.push(0x0A);
        }
        const buffer = Buffer.from(commands);
        return this.printRaw(deviceId, buffer);
    }
    async cutPaper(deviceId) {
        const cutCommands = Buffer.from([0x1D, 0x56, 0x01]);
        await this.printRaw(deviceId, cutCommands);
    }
    async openDrawer(deviceId) {
        const drawerCommands = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]);
        await this.printRaw(deviceId, drawerCommands);
    }
    async testPrint(deviceId) {
        const testText = 'Test Print\nPrinter Connected Successfully\n\n';
        return this.printText(deviceId, testText, { align: 'center' });
    }
    async getPrinterStatus(deviceId) {
        const serialPort = this.connectedPrinters.get(deviceId);
        if (!serialPort || !serialPort.isOpen) {
            return {
                connected: false,
                paperStatus: 'unknown',
                error: 'Printer not connected'
            };
        }
        const statusCommand = Buffer.from([0x10, 0x04, 0x01]);
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve({
                    connected: true,
                    paperStatus: 'unknown',
                    error: 'Status request timeout'
                });
            }, 2000);
            serialPort.once('data', (data) => {
                clearTimeout(timeout);
                if (data.length > 0) {
                    const status = data[0];
                    const paperStatus = (status & 0x60) === 0x60 ? 'out' :
                        (status & 0x0C) !== 0 ? 'low' : 'ok';
                    resolve({
                        connected: true,
                        paperStatus,
                        error: (status & 0x40) ? 'Cover open' : undefined
                    });
                }
                else {
                    resolve({
                        connected: true,
                        paperStatus: 'unknown'
                    });
                }
            });
            serialPort.write(statusCommand);
        });
    }
    async getStringDescriptor(device, index) {
        return new Promise((resolve, reject) => {
            device.getStringDescriptor(index, (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data || 'Unknown');
                }
            });
        });
    }
    isLikelyThermalPrinter(port) {
        const manufacturer = (port.manufacturer || '').toLowerCase();
        const vendorId = port.vendorId;
        const thermalManufacturers = ['xprinter', 'epson', 'citizen', 'star', 'bixolon', 'custom'];
        if (thermalManufacturers.some(mfg => manufacturer.includes(mfg))) {
            return true;
        }
        const thermalVendorIds = ['0416', '04b8', '0fe6', '1fc9', '154f'];
        if (vendorId && thermalVendorIds.includes(vendorId.toLowerCase())) {
            return true;
        }
        const serialAdapters = ['ch340', 'ch341', 'cp210x', 'ftdi', 'pl2303'];
        if (serialAdapters.some(adapter => manufacturer.includes(adapter))) {
            return true;
        }
        return false;
    }
    generateJobId() {
        return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getConnectedPrinters() {
        return Array.from(this.connectedPrinters.keys());
    }
    isConnected(deviceId) {
        const serialPort = this.connectedPrinters.get(deviceId);
        return serialPort ? serialPort.isOpen : false;
    }
};
exports.ThermalPrinterNodeService = ThermalPrinterNodeService;
exports.ThermalPrinterNodeService = ThermalPrinterNodeService = __decorate([
    (0, common_1.Injectable)()
], ThermalPrinterNodeService);
//# sourceMappingURL=thermal-printer-node.service.js.map