import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("../../schemas/sale.schema").Sale>;
    findAll(outletId?: string, startDate?: string, endDate?: string, cashierId?: string, status?: string): Promise<import("../../schemas/sale.schema").Sale[]>;
    getDailySales(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/sale.schema").Sale>;
}
