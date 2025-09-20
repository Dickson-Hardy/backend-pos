import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BatchDocument = Batch & Document

export enum BatchStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  RECALLED = "recalled",
  SOLD_OUT = "sold_out",
}

@Schema({ timestamps: true })
export class Batch {
  @Prop({ required: true })
  batchNumber: string

  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ required: true })
  manufacturingDate: Date

  @Prop({ required: true })
  expiryDate: Date

  @Prop({ required: true })
  quantity: number

  @Prop({ default: 0 })
  soldQuantity: number

  @Prop({ required: true })
  costPrice: number

  @Prop({ required: true })
  sellingPrice: number

  @Prop({ default: BatchStatus.ACTIVE, enum: BatchStatus })
  status: BatchStatus

  @Prop()
  supplierName: string

  @Prop()
  supplierInvoice: string

  @Prop()
  notes: string
}

export const BatchSchema = SchemaFactory.createForClass(Batch)
