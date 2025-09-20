import { InventoryService } from "./inventory.service";
import { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto";
import { ProductsService } from "../products/products.service";
export declare class InventoryController {
    private readonly inventoryService;
    private readonly productsService;
    constructor(inventoryService: InventoryService, productsService: ProductsService);
    getItems(outletId?: string): Promise<import("../../schemas/product.schema").Product[]>;
    getStats(outletId?: string): Promise<{
        totalProducts: number;
        totalValue: number;
        lowStockCount: number;
        lowStockProducts: import("../../schemas/product.schema").Product[];
    }>;
    adjust(createAdjustmentDto: CreateInventoryAdjustmentDto): Promise<import("../../schemas/inventory-adjustment.schema").InventoryAdjustment>;
    getAdjustments(outletId?: string, productId?: string): Promise<import("../../schemas/inventory-adjustment.schema").InventoryAdjustment[]>;
    getBatches(outletId?: string): any[];
}
