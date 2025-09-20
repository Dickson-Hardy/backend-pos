import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type PurchaseOrderDocument = PurchaseOrder & Document

export enum PurchaseOrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PurchaseOrderPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

@Schema({ timestamps: true })
export class PurchaseOrderItem {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  unitCost: number

  @Prop({ required: true })
  totalCost: number

  @Prop()
  notes?: string
}

@Schema({ timestamps: true })
export class PurchaseOrder {
  @Prop({ required: true, unique: true })
  orderNumber: string

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ required: true })
  supplierName: string

  @Prop()
  supplierEmail?: string

  @Prop()
  supplierPhone?: string

  @Prop()
  supplierAddress?: string

  @Prop({ type: [PurchaseOrderItem], required: true })
  items: PurchaseOrderItem[]

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  tax: number

  @Prop({ required: true })
  total: number

  @Prop({ required: true, enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus

  @Prop({ required: true, enum: PurchaseOrderPriority, default: PurchaseOrderPriority.NORMAL })
  priority: PurchaseOrderPriority

  @Prop({ required: true })
  orderDate: Date

  @Prop()
  expectedDeliveryDate?: Date

  @Prop()
  actualDeliveryDate?: Date

  @Prop()
  notes?: string

  @Prop({ type: Types.ObjectId, ref: "User" })
  approvedBy?: Types.ObjectId

  @Prop()
  approvedAt?: Date
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)