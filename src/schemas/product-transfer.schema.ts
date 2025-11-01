import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ProductTransferDocument = ProductTransfer & Document

export enum TransferStatus {
  PENDING = "pending",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class TransferItem {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  productName: string

  @Prop({ required: true })
  quantity: number

  @Prop()
  batchNumber?: string
}

@Schema({ timestamps: true })
export class ProductTransfer {
  @Prop({ required: true, unique: true })
  transferNumber: string

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  fromOutletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  toOutletId: Types.ObjectId

  @Prop({ type: [TransferItem], required: true })
  items: TransferItem[]

  @Prop({ required: true, enum: TransferStatus, default: TransferStatus.PENDING })
  status: TransferStatus

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  initiatedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User" })
  approvedBy?: Types.ObjectId

  @Prop()
  approvedAt?: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  receivedBy?: Types.ObjectId

  @Prop()
  receivedAt?: Date

  @Prop()
  notes?: string
}

export const ProductTransferSchema = SchemaFactory.createForClass(ProductTransfer)

ProductTransferSchema.index({ fromOutletId: 1 })
ProductTransferSchema.index({ toOutletId: 1 })
ProductTransferSchema.index({ status: 1 })
ProductTransferSchema.index({ transferNumber: 1 })
