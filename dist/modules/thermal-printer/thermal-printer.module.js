"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermalPrinterModule = void 0;
const common_1 = require("@nestjs/common");
const thermal_printer_controller_1 = require("./thermal-printer.controller");
const thermal_printer_node_service_1 = require("./thermal-printer-node.service");
let ThermalPrinterModule = class ThermalPrinterModule {
};
exports.ThermalPrinterModule = ThermalPrinterModule;
exports.ThermalPrinterModule = ThermalPrinterModule = __decorate([
    (0, common_1.Module)({
        controllers: [thermal_printer_controller_1.ThermalPrinterController],
        providers: [thermal_printer_node_service_1.ThermalPrinterNodeService],
        exports: [thermal_printer_node_service_1.ThermalPrinterNodeService],
    })
], ThermalPrinterModule);
//# sourceMappingURL=thermal-printer.module.js.map