import { ThermalPrinterNodeService } from './thermal-printer-node.service';
export declare class ThermalPrinterController {
    private readonly thermalPrinterService;
    constructor(thermalPrinterService: ThermalPrinterNodeService);
    scanUSBPrinters(): Promise<import("./thermal-printer-node.service").USBPrinterDevice[]>;
    scanSerialPrinters(): Promise<import("./thermal-printer-node.service").SerialPrinterDevice[]>;
    connectSerial(deviceData: {
        id: string;
        path: string;
        baudRate: number;
    }): Promise<{
        message: string;
        deviceId: string;
    }>;
    disconnect(deviceId: string): Promise<{
        message: string;
    }>;
    printText(deviceId: string, printData: {
        text: string;
        align?: 'left' | 'center' | 'right';
        bold?: boolean;
        underline?: boolean;
        fontSize?: 'normal' | 'large';
        lineFeed?: number;
    }): Promise<import("./thermal-printer-node.service").NodePrintJob>;
    printRaw(deviceId: string, printData: {
        data: number[];
    }): Promise<import("./thermal-printer-node.service").NodePrintJob>;
    cutPaper(deviceId: string): Promise<{
        message: string;
    }>;
    openDrawer(deviceId: string): Promise<{
        message: string;
    }>;
    testPrint(deviceId: string): Promise<import("./thermal-printer-node.service").NodePrintJob>;
    getPrinterStatus(deviceId: string): Promise<{
        connected: boolean;
        paperStatus: "ok" | "low" | "out" | "unknown";
        error?: string;
    }>;
    getConnectedPrinters(): Promise<{
        printers: string[];
    }>;
    isConnected(deviceId: string): Promise<{
        connected: boolean;
    }>;
}
