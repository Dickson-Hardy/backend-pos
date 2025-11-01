import type { Model } from "mongoose";
import { Sale, type SaleDocument } from "../../schemas/sale.schema";
import { type PackVariantDocument } from "../../schemas/pack-variant.schema";
import { ProductsService } from "../products/products.service";
import { ShiftsService } from "../shifts/shifts.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import type { CreateSaleDto } from "./dto/create-sale.dto";
export declare class SalesService {
    private saleModel;
    private packVariantModel;
    private productsService;
    private shiftsService;
    private websocketGateway;
    constructor(saleModel: Model<SaleDocument>, packVariantModel: Model<PackVariantDocument>, productsService: ProductsService, shiftsService: ShiftsService, websocketGateway: WebsocketGateway);
    create(createSaleDto: CreateSaleDto): Promise<Sale>;
    private processPackSale;
    findAll(outletId?: string, startDate?: Date, endDate?: Date, cashierId?: string, status?: string): Promise<Sale[]>;
    findOne(id: string): Promise<Sale>;
    getDailySales(outletId?: string): Promise<any>;
    searchSales(query: string, outletId?: string): Promise<Sale[]>;
    getSalesByHour(outletId?: string, date?: Date): Promise<any>;
    getSalesByCategory(outletId?: string, startDate?: Date, endDate?: Date): Promise<any>;
    getCashierPerformance(outletId?: string, startDate?: Date, endDate?: Date): Promise<any>;
    getPaymentMethodBreakdown(outletId?: string, startDate?: Date, endDate?: Date): Promise<any>;
    getSalesComparison(outletId?: string): Promise<any>;
    private generateReceiptNumber;
}
