import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ExpenseDocument = Expense & Document

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Shift' })
  shiftId: Types.ObjectId

  @Prop({ required: true, min: 0 })
  amount: number

  @Prop({ required: true, trim: true })
  description: string

  @Prop({ 
    required: true, 
    enum: ['operational', 'maintenance', 'supplies', 'other'],
    default: 'operational'
  })
  category: 'operational' | 'maintenance' | 'supplies' | 'other'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  addedBy?: Types.ObjectId

  @Prop()
  receiptNumber?: string

  @Prop()
  notes?: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense)

// Index for efficient queries
ExpenseSchema.index({ shiftId: 1, createdAt: -1 })
ExpenseSchema.index({ category: 1, createdAt: -1 })
