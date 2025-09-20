import type { Model } from "mongoose";
import { Sale, type SaleDocument } from "../../schemas/sale.schema";
import { ProductsService } from "../products/products.service";
import type { CreateSaleDto } from "./dto/create-sale.dto";
export declare class SalesService {
    private saleModel;
    private productsService;
    constructor(saleModel: Model<SaleDocument>, productsService: ProductsService);
    create(createSaleDto: CreateSaleDto): Promise<Sale>;
    findAll(outletId?: string, startDate?: Date, endDate?: Date): Promise<Sale[]>;
    findOne(id: string): Promise<Sale>;
    getDailySales(outletId?: string): Promise<any>;
    private generateReceiptNumber;
}
