import { type Document, Types } from "mongoose";
export type InventoryAdjustmentDocument = InventoryAdjustment & Document;
export declare enum AdjustmentType {
    INCREASE = "increase",
    DECREASE = "decrease",
    DAMAGE = "damage",
    EXPIRED = "expired",
    RETURN = "return",
    RECOUNT = "recount"
}
export declare class InventoryAdjustment {
    productId: Types.ObjectId;
    outletId: Types.ObjectId;
    adjustedBy: Types.ObjectId;
    previousQuantity: number;
    adjustedQuantity: number;
    newQuantity: number;
    type: AdjustmentType;
    reason: string;
    batchNumber: string;
    notes: string;
    adjustmentDate: Date;
}
export declare const InventoryAdjustmentSchema: import("mongoose").Schema<InventoryAdjustment, import("mongoose").Model<InventoryAdjustment, any, any, any, Document<unknown, any, InventoryAdjustment> & InventoryAdjustment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InventoryAdjustment, Document<unknown, {}, import("mongoose").FlatRecord<InventoryAdjustment>> & import("mongoose").FlatRecord<InventoryAdjustment> & {
    _id: Types.ObjectId;
}>;
