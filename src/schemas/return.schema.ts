import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ReturnDocument = Return & Document

export enum ReturnReason {
  EXPIRED = "expired",
  DAMAGED = "damaged",
  WRONG_ITEM = "wrong_item",
  CUSTOMER_REQUEST = "customer_request",
  DEFECTIVE = "defective",
  OTHER = "other",
}

export enum ReturnStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

export enum RefundMethod {
  CASH = "cash",
  CARD_REVERSAL = "card_reversal",
  STORE_CREDIT = "store_credit",
  EXCHANGE = "exchange",
}

@Schema({ timestamps: true })
export class ReturnItem {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  productName: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalRefund: number

  @Prop({ required: true, enum: ReturnReason })
  reason: ReturnReason

  @Prop()
  batchNumber?: string
}

@Schema({ timestamps: true })
export class Return {
  @Prop({ required: true, unique: true })
  returnNumber: string

  @Prop({ type: Types.ObjectId, ref: "Sale", required: true })
  originalSaleId: Types.ObjectId

  @Prop({ required: true })
  originalReceiptNumber: string

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  processedBy: Types.ObjectId

  @Prop({ type: [ReturnItem], required: true })
  items: ReturnItem[]

  @Prop({ required: true })
  totalRefundAmount: number

  @Prop({ required: true, enum: ReturnStatus, default: ReturnStatus.PENDING })
  status: ReturnStatus

  @Prop({ required: true, enum: RefundMethod })
  refundMethod: RefundMethod

  @Prop()
  customerName?: string

  @Prop()
  customerPhone?: string

  @Prop()
  notes?: string

  @Prop({ type: Types.ObjectId, ref: "User" })
  approvedBy?: Types.ObjectId

  @Prop()
  approvedAt?: Date

  @Prop({ default: false })
  restockedToInventory: boolean
}

export const ReturnSchema = SchemaFactory.createForClass(Return)

ReturnSchema.index({ originalSaleId: 1 })
ReturnSchema.index({ returnNumber: 1 })
ReturnSchema.index({ status: 1 })
ReturnSchema.index({ outletId: 1 })
