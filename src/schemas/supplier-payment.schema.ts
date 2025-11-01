import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type SupplierPaymentDocument = SupplierPayment & Document

export enum PaymentStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  PAID = "paid",
  OVERDUE = "overdue",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CHEQUE = "cheque",
  MOBILE_MONEY = "mobile_money",
}

@Schema({ timestamps: true })
export class SupplierPayment {
  @Prop({ required: true, unique: true })
  paymentNumber: string

  @Prop({ type: Types.ObjectId, ref: "PurchaseOrder", required: true })
  purchaseOrderId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Supplier", required: true })
  supplierId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Outlet", required: true })
  outletId: Types.ObjectId

  @Prop({ required: true })
  totalAmount: number

  @Prop({ default: 0 })
  paidAmount: number

  @Prop({ required: true })
  balanceAmount: number

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus

  @Prop({ required: true })
  dueDate: Date

  @Prop()
  paidDate?: Date

  @Prop({ enum: PaymentMethod })
  paymentMethod?: PaymentMethod

  @Prop()
  referenceNumber?: string

  @Prop()
  notes?: string

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User" })
  approvedBy?: Types.ObjectId
}

export const SupplierPaymentSchema = SchemaFactory.createForClass(SupplierPayment)

SupplierPaymentSchema.index({ purchaseOrderId: 1 })
SupplierPaymentSchema.index({ supplierId: 1 })
SupplierPaymentSchema.index({ status: 1 })
SupplierPaymentSchema.index({ dueDate: 1 })
