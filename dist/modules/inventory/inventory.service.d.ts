import type { Model } from "mongoose";
import { InventoryAdjustment, type InventoryAdjustmentDocument } from "../../schemas/inventory-adjustment.schema";
import { type PackVariantDocument } from "../../schemas/pack-variant.schema";
import { Batch, type BatchDocument } from "../../schemas/batch.schema";
import { ProductsService } from "../products/products.service";
import type { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto";
import type { EnhancedInventoryDto } from "./dto/enhanced-inventory.dto";
export declare class InventoryService {
    private inventoryAdjustmentModel;
    private packVariantModel;
    private batchModel;
    private productsService;
    constructor(inventoryAdjustmentModel: Model<InventoryAdjustmentDocument>, packVariantModel: Model<PackVariantDocument>, batchModel: Model<BatchDocument>, productsService: ProductsService);
    adjustInventory(createAdjustmentDto: CreateInventoryAdjustmentDto): Promise<InventoryAdjustment>;
    getAdjustmentHistory(outletId?: string, productId?: string): Promise<InventoryAdjustment[]>;
    getEnhancedInventory(outletId?: string): Promise<EnhancedInventoryDto[]>;
    getProductPackInfo(productId: string): Promise<{
        totalUnits: number;
        packBreakdown: any[];
        looseUnits: number;
        formattedDisplay: string;
    }>;
    updateInventoryItem(productId: string, update: {
        reorderLevel?: number;
        maxStockLevel?: number;
    }): Promise<import("../../schemas/product.schema").Product>;
    listBatches(outletId?: string, productId?: string): Promise<(import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getBatch(id: string): Promise<import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createBatch(dto: {
        batchNumber: string;
        productId: string;
        outletId: string;
        manufacturingDate: string;
        expiryDate: string;
        quantity: number;
        costPrice: number;
        sellingPrice: number;
        supplierName?: string;
        supplierInvoice?: string;
        notes?: string;
    }): Promise<import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateBatch(id: string, dto: Partial<{
        batchNumber: string;
        manufacturingDate: string;
        expiryDate: string;
        quantity: number;
        soldQuantity: number;
        costPrice: number;
        sellingPrice: number;
        status: string;
        supplierName?: string;
        supplierInvoice?: string;
        notes?: string;
    }>): Promise<import("mongoose").Document<unknown, {}, BatchDocument> & Batch & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteBatch(id: string): Promise<{
        success: boolean;
    }>;
}
