import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type OutletDocument = Outlet & Document

export enum OutletStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}

@Schema({ timestamps: true })
export class Outlet {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  state: string

  @Prop({ required: true })
  zipCode: string

  @Prop({ required: true })
  phone: string

  @Prop()
  email: string

  @Prop({ required: true })
  licenseNumber: string

  @Prop({ type: Types.ObjectId, ref: "User" })
  managerId: Types.ObjectId

  @Prop({ default: OutletStatus.ACTIVE, enum: OutletStatus })
  status: OutletStatus

  @Prop({ default: 0 })
  totalSales: number

  @Prop({ default: 0 })
  totalTransactions: number

  @Prop({
    type: {
      open: String,
      close: String,
      days: [String],
    },
  })
  operatingHours: {
    open: string
    close: string
    days: string[]
  }
}

export const OutletSchema = SchemaFactory.createForClass(Outlet)
