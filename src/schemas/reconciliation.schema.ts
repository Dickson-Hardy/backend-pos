import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ReconciliationDocument = Reconciliation & Document

export enum ReconciliationType {
  DAILY_CASH = "daily_cash",
  SHIFT_RECONCILIATION = "shift_reconciliation", 
  BANK_RECONCILIATION = "bank_reconciliation",
  INVENTORY_COUNT = "inventory_count",
  PAYMENT_RECONCILIATION = "payment_reconciliation"
}

export enum ReconciliationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed", 
  APPROVED = "approved",
  VARIANCE_FOUND = "variance_found",
  REQUIRES_REVIEW = "requires_review"
}

// Cash denomination breakdown
@Schema({ _id: false })
export class CashBreakdown {
  @Prop({ default: 0 })
  hundreds: number // $100 bills

  @Prop({ default: 0 })
  fifties: number // $50 bills

  @Prop({ default: 0 })
  twenties: number // $20 bills

  @Prop({ default: 0 })
  tens: number // $10 bills

  @Prop({ default: 0 })
  fives: number // $5 bills

  @Prop({ default: 0 })
  ones: number // $1 bills

  @Prop({ default: 0 })
  quarters: number // $0.25 coins

  @Prop({ default: 0 })
  dimes: number // $0.10 coins

  @Prop({ default: 0 })
  nickels: number // $0.05 coins

  @Prop({ default: 0 })
  pennies: number // $0.01 coins

  @Prop()
  totalCounted: number // Calculated total
}

// Daily cash reconciliation data
@Schema({ _id: false })
export class DailyCashData {
  @Prop({ required: true })
  startingCash: number

  @Prop({ required: true })
  expectedCash: number // Starting cash + cash sales - cash paid outs

  @Prop({ type: CashBreakdown, required: true })
  actualCashCount: CashBreakdown

  @Prop({ required: true })
  actualCashTotal: number

  @Prop({ required: true })
  variance: number // Expected - Actual

  @Prop()
  cashSales: number

  @Prop()
  cashRefunds: number

  @Prop()
  cashPayouts: number

  @Prop()
  tillFloat: number // Float amount for next day

  @Prop()
  depositAmount: number // Amount to be deposited

  @Prop()
  varianceNotes: string
}

// Bank reconciliation data
@Schema({ _id: false })
export class BankReconciliationData {
  @Prop({ required: true })
  statementDate: Date

  @Prop({ required: true })
  statementBalance: number

  @Prop({ required: true })
  bookBalance: number

  @Prop({ required: true })
  reconciledBalance: number

  @Prop({ type: [Object], default: [] })
  outstandingDeposits: Array<{
    date: Date
    amount: number
    reference: string
    description: string
  }>

  @Prop({ type: [Object], default: [] })
  outstandingWithdrawals: Array<{
    date: Date
    amount: number
    reference: string
    description: string
  }>

  @Prop({ type: [Object], default: [] })
  bankAdjustments: Array<{
    date: Date
    amount: number
    type: 'fee' | 'interest' | 'charge' | 'credit'
    description: string
  }>

  @Prop()
  variance: number
}

// Inventory reconciliation item
@Schema({ _id: false })
export class InventoryReconciliationItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  productName: string

  @Prop({ required: true })
  expectedQuantity: number

  @Prop({ required: true })
  countedQuantity: number

  @Prop({ required: true })
  variance: number

  @Prop({ required: true })
  unitCost: number

  @Prop({ required: true })
  varianceValue: number // variance * unit cost

  @Prop()
  batchNumber: string

  @Prop()
  expiryDate: Date

  @Prop()
  reason: string // Reason for variance

  @Prop()
  location: string // Shelf/storage location
}

// Payment reconciliation data
@Schema({ _id: false })
export class PaymentReconciliationData {
  @Prop({ type: Object, required: true })
  expectedTotals: {
    cash: number
    creditCard: number
    debitCard: number
    check: number
    giftCard: number
    insurance: number
    other: number
  }

  @Prop({ type: Object, required: true })
  actualTotals: {
    cash: number
    creditCard: number
    debitCard: number
    check: number
    giftCard: number
    insurance: number
    other: number
  }

  @Prop({ type: Object, required: true })
  variances: {
    cash: number
    creditCard: number
    debitCard: number
    check: number
    giftCard: number
    insurance: number
    other: number
  }

  @Prop({ type: [Object], default: [] })
  creditCardBatches: Array<{
    batchNumber: string
    amount: number
    transactionCount: number
    processor: string
    settlementDate: Date
  }>
}

@Schema({ timestamps: true })
export class Reconciliation {
  @Prop({ enum: ReconciliationType, required: true })
  type: ReconciliationType

  @Prop({ enum: ReconciliationStatus, default: ReconciliationStatus.PENDING })
  status: ReconciliationStatus

  @Prop({ type: Types.ObjectId, ref: 'Outlet', required: true })
  outletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId

  @Prop({ required: true })
  reconciliationDate: Date

  @Prop()
  periodStart: Date

  @Prop()
  periodEnd: Date

  // Type-specific data
  @Prop({ type: DailyCashData })
  cashData: DailyCashData

  @Prop({ type: BankReconciliationData })
  bankData: BankReconciliationData

  @Prop({ type: [InventoryReconciliationItem] })
  inventoryItems: InventoryReconciliationItem[]

  @Prop({ type: PaymentReconciliationData })
  paymentData: PaymentReconciliationData

  // General fields
  @Prop()
  totalVariance: number

  @Prop({ default: false })
  hasSignificantVariance: boolean

  @Prop()
  varianceThreshold: number

  @Prop()
  notes: string

  @Prop()
  managerNotes: string

  @Prop({ type: [String], default: [] })
  attachments: string[] // Photo evidence, receipts, etc.

  @Prop()
  completedAt: Date

  @Prop()
  reviewedAt: Date

  @Prop()
  approvedAt: Date

  // Audit trail
  @Prop({ type: [Object], default: [] })
  auditTrail: Array<{
    action: string
    performedBy: Types.ObjectId
    timestamp: Date
    details: string
    oldValues?: Record<string, any>
    newValues?: Record<string, any>
  }>
}

export const ReconciliationSchema = SchemaFactory.createForClass(Reconciliation)

// Indexes for efficient queries
ReconciliationSchema.index({ outletId: 1, type: 1, reconciliationDate: -1 })
ReconciliationSchema.index({ status: 1, createdAt: -1 })
ReconciliationSchema.index({ performedBy: 1, reconciliationDate: -1 })
ReconciliationSchema.index({ hasSignificantVariance: 1, status: 1 })