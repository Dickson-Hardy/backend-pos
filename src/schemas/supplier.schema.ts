import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type SupplierDocument = Supplier & Document

export enum SupplierStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  contactPerson: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  phone: string

  @Prop({ required: true })
  address: string

  @Prop({ default: SupplierStatus.ACTIVE, enum: SupplierStatus })
  status: SupplierStatus

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number

  @Prop({ default: 0 })
  productsSupplied: number

  @Prop()
  lastOrder?: Date

  @Prop({ default: "30 days" })
  paymentTerms: string

  @Prop()
  website?: string

  @Prop()
  taxId?: string

  @Prop()
  bankDetails?: string

  @Prop()
  notes?: string

  @Prop({ type: [String], default: [] })
  categories: string[]

  @Prop({ type: Types.ObjectId, ref: "Outlet" })
  outletId: Types.ObjectId
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier)

// Create indexes
SupplierSchema.index({ name: 1, outletId: 1 }, { unique: true })
SupplierSchema.index({ email: 1 })
SupplierSchema.index({ status: 1 })
SupplierSchema.index({ outletId: 1 })