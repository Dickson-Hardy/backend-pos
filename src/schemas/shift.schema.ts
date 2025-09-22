import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ShiftDocument = Shift & Document

@Schema({ timestamps: true })
export class Shift {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  cashierId: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'Outlet' })
  outletId: Types.ObjectId

  @Prop({ required: true })
  startTime: Date

  @Prop()
  endTime?: Date

  @Prop({ required: true, min: 0 })
  openingBalance: number

  @Prop({ min: 0 })
  closingBalance?: number

  @Prop({ default: 0, min: 0 })
  totalSales: number

  @Prop({ default: 0, min: 0 })
  totalExpenses: number

  @Prop({ default: 0 })
  netAmount: number

  @Prop({ 
    required: true, 
    enum: ['active', 'closed'],
    default: 'active'
  })
  status: 'active' | 'closed'

  @Prop()
  notes?: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}

export const ShiftSchema = SchemaFactory.createForClass(Shift)

// Index for efficient queries
ShiftSchema.index({ cashierId: 1, status: 1 })
ShiftSchema.index({ outletId: 1, startTime: 1 })
ShiftSchema.index({ status: 1, startTime: 1 })
