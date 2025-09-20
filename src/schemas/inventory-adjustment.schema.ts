import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type InventoryAdjustmentDocument = InventoryAdjustment & Document

export enum AdjustmentType {
  INCREASE = "increase",
  DECREASE = "decrease",
  DAMAGE = "damage",
  EXPIRED = "expired",
  RETURN = "return",
  RECOUNT = "recount",
}

@Schema({ timestamps: true })
export class InventoryAdjustment {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  adjustedBy: Types.ObjectId

  @Prop({ required: true })
  previousQuantity: number

  @Prop({ required: true })
  adjustedQuantity: number

  @Prop({ required: true })
  newQuantity: number

  @Prop({ required: true, enum: AdjustmentType })
  type: AdjustmentType

  @Prop({ required: true })
  reason: string

  @Prop()
  batchNumber: string

  @Prop()
  notes: string

  @Prop({ default: Date.now })
  adjustmentDate: Date
}

export const InventoryAdjustmentSchema = SchemaFactory.createForClass(InventoryAdjustment)
