"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermalPrinterController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const thermal_printer_node_service_1 = require("./thermal-printer-node.service");
let ThermalPrinterController = class ThermalPrinterController {
    constructor(thermalPrinterService) {
        this.thermalPrinterService = thermalPrinterService;
    }
    async scanUSBPrinters() {
        try {
            return await this.thermalPrinterService.scanUSBPrinters();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async scanSerialPrinters() {
        try {
            return await this.thermalPrinterService.scanSerialPrinters();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async connectSerial(deviceData) {
        try {
            await this.thermalPrinterService.connectSerial({
                id: deviceData.id,
                name: `Serial Printer (${deviceData.path})`,
                path: deviceData.path,
                baudRate: deviceData.baudRate,
                status: 'disconnected'
            });
            return { message: 'Connected successfully', deviceId: deviceData.id };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async disconnect(deviceId) {
        try {
            await this.thermalPrinterService.disconnect(deviceId);
            return { message: 'Disconnected successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async printText(deviceId, printData) {
        try {
            const job = await this.thermalPrinterService.printText(deviceId, printData.text, {
                align: printData.align,
                bold: printData.bold,
                underline: printData.underline,
                fontSize: printData.fontSize,
                lineFeed: printData.lineFeed
            });
            return job;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async printRaw(deviceId, printData) {
        try {
            const buffer = Buffer.from(printData.data);
            const job = await this.thermalPrinterService.printRaw(deviceId, buffer);
            return job;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async cutPaper(deviceId) {
        try {
            await this.thermalPrinterService.cutPaper(deviceId);
            return { message: 'Paper cut command sent' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async openDrawer(deviceId) {
        try {
            await this.thermalPrinterService.openDrawer(deviceId);
            return { message: 'Cash drawer open command sent' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async testPrint(deviceId) {
        try {
            const job = await this.thermalPrinterService.testPrint(deviceId);
            return job;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getPrinterStatus(deviceId) {
        try {
            return await this.thermalPrinterService.getPrinterStatus(deviceId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getConnectedPrinters() {
        return {
            printers: this.thermalPrinterService.getConnectedPrinters()
        };
    }
    async isConnected(deviceId) {
        return {
            connected: this.thermalPrinterService.isConnected(deviceId)
        };
    }
};
exports.ThermalPrinterController = ThermalPrinterController;
__decorate([
    (0, common_1.Get)('scan/usb'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "scanUSBPrinters", null);
__decorate([
    (0, common_1.Get)('scan/serial'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "scanSerialPrinters", null);
__decorate([
    (0, common_1.Post)('connect/serial'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "connectSerial", null);
__decorate([
    (0, common_1.Post)('disconnect/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Post)('print/text/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "printText", null);
__decorate([
    (0, common_1.Post)('print/raw/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "printRaw", null);
__decorate([
    (0, common_1.Post)('cut/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "cutPaper", null);
__decorate([
    (0, common_1.Post)('drawer/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "openDrawer", null);
__decorate([
    (0, common_1.Post)('test/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "testPrint", null);
__decorate([
    (0, common_1.Get)('status/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "getPrinterStatus", null);
__decorate([
    (0, common_1.Get)('connected'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "getConnectedPrinters", null);
__decorate([
    (0, common_1.Get)('connected/:deviceId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThermalPrinterController.prototype, "isConnected", null);
exports.ThermalPrinterController = ThermalPrinterController = __decorate([
    (0, common_1.Controller)('thermal-printer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [thermal_printer_node_service_1.ThermalPrinterNodeService])
], ThermalPrinterController);
//# sourceMappingURL=thermal-printer.controller.js.map