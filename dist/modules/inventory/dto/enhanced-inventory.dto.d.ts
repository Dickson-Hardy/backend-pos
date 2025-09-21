import type { PackVariant } from "../../../schemas/pack-variant.schema";
export declare class PackInventoryBreakdownDto {
    variant: PackVariant;
    availablePacks: number;
}
export declare class EnhancedInventoryDto {
    productId: string;
    productName: string;
    totalUnits: number;
    packBreakdown: PackInventoryBreakdownDto[];
    looseUnits: number;
    totalValue: number;
    formattedDisplay: string;
    reorderLevel: number;
    maxStockLevel: number;
    needsReorder: boolean;
}
