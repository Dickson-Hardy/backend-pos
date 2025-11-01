import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("../../schemas/sale.schema").Sale>;
    findAll(outletId?: string, startDate?: string, endDate?: string, cashierId?: string, status?: string): Promise<import("../../schemas/sale.schema").Sale[]>;
    getDailySales(outletId?: string): Promise<any>;
    search(query: string, outletId?: string): Promise<import("../../schemas/sale.schema").Sale[]>;
    getHourlySales(outletId?: string, date?: string): Promise<any>;
    getSalesByCategory(outletId?: string, startDate?: string, endDate?: string): Promise<any>;
    getCashierPerformance(outletId?: string, startDate?: string, endDate?: string): Promise<any>;
    getPaymentMethods(outletId?: string, startDate?: string, endDate?: string): Promise<any>;
    getSalesComparison(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/sale.schema").Sale>;
}
