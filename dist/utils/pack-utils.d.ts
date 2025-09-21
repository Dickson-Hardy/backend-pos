import type { PackVariant } from "../schemas/pack-variant.schema";
export interface PackInventoryBreakdown {
    packBreakdown: Array<{
        variant: PackVariant;
        availablePacks: number;
    }>;
    looseUnits: number;
    totalValue: number;
}
export declare class PackUtils {
    static calculatePackInventory(totalUnits: number, packVariants: PackVariant[]): PackInventoryBreakdown;
    static getAvailablePacks(totalUnits: number, packSize: number): number;
    static getLooseUnits(totalUnits: number, packSize: number): number;
    static formatInventoryDisplay(totalUnits: number, packVariants: PackVariant[]): string;
    static validatePackSale(packVariant: PackVariant, packQuantity: number, availableUnits: number): {
        isValid: boolean;
        error?: string;
    };
    static calculateOptimalPacking(targetUnits: number, packVariants: PackVariant[]): Array<{
        variant: PackVariant;
        quantity: number;
    }>;
}
