import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type SaleDocument = Sale & Document

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  MOBILE = "mobile",
  INSURANCE = "insurance",
}

export enum SaleStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

@Schema({ timestamps: true })
export class SaleItem {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  productName: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalPrice: number

  @Prop()
  batchNumber: string

  @Prop()
  discount: number
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  receiptNumber: string

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  cashierId: Types.ObjectId

  @Prop({ required: true })
  items: SaleItem[]

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  discount: number

  @Prop({ default: 0 })
  tax: number

  @Prop({ required: true })
  total: number

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Prop({ default: SaleStatus.COMPLETED, enum: SaleStatus })
  status: SaleStatus

  @Prop()
  customerName: string

  @Prop()
  customerPhone: string

  @Prop()
  prescriptionNumber: string

  @Prop()
  doctorName: string

  @Prop()
  notes: string

  @Prop({ default: Date.now })
  saleDate: Date
}

export const SaleSchema = SchemaFactory.createForClass(Sale)
