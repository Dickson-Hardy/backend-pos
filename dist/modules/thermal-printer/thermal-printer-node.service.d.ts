export interface USBPrinterDevice {
    id: string;
    name: string;
    vendorId: number;
    productId: number;
    path?: string;
    serialNumber?: string;
    manufacturer?: string;
    status: 'connected' | 'disconnected' | 'error';
}
export interface SerialPrinterDevice {
    id: string;
    name: string;
    path: string;
    baudRate: number;
    status: 'connected' | 'disconnected' | 'error';
}
export interface NodePrintJob {
    id: string;
    data: Buffer;
    status: 'pending' | 'printing' | 'completed' | 'failed';
    error?: string;
    startTime?: Date;
    endTime?: Date;
}
export declare class ThermalPrinterNodeService {
    private connectedPrinters;
    private readonly THERMAL_PRINTER_IDS;
    scanUSBPrinters(): Promise<USBPrinterDevice[]>;
    scanSerialPrinters(): Promise<SerialPrinterDevice[]>;
    connectSerial(device: SerialPrinterDevice): Promise<void>;
    disconnect(deviceId: string): Promise<void>;
    printRaw(deviceId: string, data: Buffer): Promise<NodePrintJob>;
    printText(deviceId: string, text: string, options?: {
        align?: 'left' | 'center' | 'right';
        bold?: boolean;
        underline?: boolean;
        fontSize?: 'normal' | 'large';
        lineFeed?: number;
    }): Promise<NodePrintJob>;
    cutPaper(deviceId: string): Promise<void>;
    openDrawer(deviceId: string): Promise<void>;
    testPrint(deviceId: string): Promise<NodePrintJob>;
    getPrinterStatus(deviceId: string): Promise<{
        connected: boolean;
        paperStatus: 'ok' | 'low' | 'out' | 'unknown';
        error?: string;
    }>;
    private getStringDescriptor;
    private isLikelyThermalPrinter;
    private generateJobId;
    getConnectedPrinters(): string[];
    isConnected(deviceId: string): boolean;
}
