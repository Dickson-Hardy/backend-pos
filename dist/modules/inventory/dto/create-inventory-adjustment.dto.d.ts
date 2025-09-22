import { AdjustmentType } from "../../../schemas/inventory-adjustment.schema";
export declare class CreateInventoryAdjustmentDto {
    productId: string;
    outletId: string;
    adjustedQuantity: number;
    reason: string;
    adjustedBy: string;
    type: AdjustmentType;
    notes?: string;
}
