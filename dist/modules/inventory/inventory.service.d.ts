import type { Model } from "mongoose";
import { InventoryAdjustment, type InventoryAdjustmentDocument } from "../../schemas/inventory-adjustment.schema";
import { ProductsService } from "../products/products.service";
import type { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto";
export declare class InventoryService {
    private inventoryAdjustmentModel;
    private productsService;
    constructor(inventoryAdjustmentModel: Model<InventoryAdjustmentDocument>, productsService: ProductsService);
    adjustInventory(createAdjustmentDto: CreateInventoryAdjustmentDto): Promise<InventoryAdjustment>;
    getAdjustmentHistory(outletId?: string, productId?: string): Promise<InventoryAdjustment[]>;
}
