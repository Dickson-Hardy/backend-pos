import { InventoryService } from "./inventory.service";
import { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto";
import { ProductsService } from "../products/products.service";
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
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
    getBatches(outletId?: string, productId?: string): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateInventoryItem(productId: string, dto: UpdateInventoryItemDto): Promise<import("../../schemas/product.schema").Product>;
    getBatch(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createBatch(dto: CreateBatchDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateBatch(id: string, dto: UpdateBatchDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/batch.schema").BatchDocument> & import("../../schemas/batch.schema").Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteBatch(id: string): Promise<{
        success: boolean;
    }>;
}
