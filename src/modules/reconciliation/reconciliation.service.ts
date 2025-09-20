import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { Types } from 'mongoose'
import { 
  Reconciliation, 
  type ReconciliationDocument, 
  ReconciliationType,
  ReconciliationStatus,
  type DailyCashData,
  type BankReconciliationData,
  type PaymentReconciliationData
} from '../../schemas/reconciliation.schema'
import { Sale, type SaleDocument, PaymentMethod } from '../../schemas/sale.schema'
import { Product, type ProductDocument } from '../../schemas/product.schema'

@Injectable()
export class ReconciliationService {
  constructor(
    @InjectModel(Reconciliation.name)
    private reconciliationModel: Model<ReconciliationDocument>,
    @InjectModel(Sale.name)
    private saleModel: Model<SaleDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>
  ) {}

  // DAILY CASH RECONCILIATION
  async startDailyCashReconciliation(data: {
    outletId: string
    performedBy: string
    reconciliationDate: Date
    startingCash: number
  }): Promise<Reconciliation> {
    // Calculate expected cash from sales data
    const dateStart = new Date(data.reconciliationDate)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(data.reconciliationDate)
    dateEnd.setHours(23, 59, 59, 999)

    const salesData = await this.calculateDailySalesData(data.outletId, dateStart, dateEnd)

    const expectedCash = data.startingCash + salesData.cashSales - salesData.cashRefunds - salesData.cashPayouts

    const reconciliation = new this.reconciliationModel({
      type: ReconciliationType.DAILY_CASH,
      status: ReconciliationStatus.IN_PROGRESS,
      outletId: data.outletId,
      performedBy: data.performedBy,
      reconciliationDate: data.reconciliationDate,
      periodStart: dateStart,
      periodEnd: dateEnd,
      cashData: {
        startingCash: data.startingCash,
        expectedCash,
        cashSales: salesData.cashSales,
        cashRefunds: salesData.cashRefunds,
        cashPayouts: salesData.cashPayouts,
        actualCashCount: {
          hundreds: 0,
          fifties: 0,
          twenties: 0,
          tens: 0,
          fives: 0,
          ones: 0,
          quarters: 0,
          dimes: 0,
          nickels: 0,
          pennies: 0,
          totalCounted: 0
        },
        actualCashTotal: 0,
        variance: 0
      }
    })

    return reconciliation.save()
  }

  async submitCashCount(reconciliationId: string, cashCount: {
    hundreds: number
    fifties: number
    twenties: number
    tens: number
    fives: number
    ones: number
    quarters: number
    dimes: number
    nickels: number
    pennies: number
  }, performedBy: string): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationModel.findById(reconciliationId)
    
    if (!reconciliation) {
      throw new NotFoundException('Reconciliation not found')
    }

    // Calculate total counted cash
    const totalCounted = 
      (cashCount.hundreds * 100) +
      (cashCount.fifties * 50) +
      (cashCount.twenties * 20) +
      (cashCount.tens * 10) +
      (cashCount.fives * 5) +
      (cashCount.ones * 1) +
      (cashCount.quarters * 0.25) +
      (cashCount.dimes * 0.10) +
      (cashCount.nickels * 0.05) +
      (cashCount.pennies * 0.01)

    const variance = reconciliation.cashData.expectedCash - totalCounted

    // Update reconciliation with cash count
    reconciliation.cashData.actualCashCount = {
      ...cashCount,
      totalCounted
    }
    reconciliation.cashData.actualCashTotal = totalCounted
    reconciliation.cashData.variance = variance
    reconciliation.totalVariance = Math.abs(variance)
    reconciliation.hasSignificantVariance = Math.abs(variance) > 10 // $10 threshold
    reconciliation.status = ReconciliationStatus.COMPLETED

    // Add audit trail
    reconciliation.auditTrail.push({
      action: 'cash_count_submitted',
      performedBy: new Types.ObjectId(performedBy),
      timestamp: new Date(),
      details: `Cash count submitted. Variance: $${variance.toFixed(2)}`
    })

    return reconciliation.save()
  }

  // SHIFT RECONCILIATION
  async createShiftReconciliation(data: {
    outletId: string
    performedBy: string
    shiftStart: Date
    shiftEnd: Date
    startingCash: number
  }): Promise<Reconciliation> {
    const salesData = await this.calculateDailySalesData(data.outletId, data.shiftStart, data.shiftEnd)
    
    const reconciliation = new this.reconciliationModel({
      type: ReconciliationType.SHIFT_RECONCILIATION,
      status: ReconciliationStatus.IN_PROGRESS,
      outletId: data.outletId,
      performedBy: data.performedBy,
      reconciliationDate: new Date(),
      periodStart: data.shiftStart,
      periodEnd: data.shiftEnd,
      cashData: {
        startingCash: data.startingCash,
        expectedCash: data.startingCash + salesData.cashSales - salesData.cashRefunds,
        cashSales: salesData.cashSales,
        cashRefunds: salesData.cashRefunds,
        cashPayouts: salesData.cashPayouts,
        actualCashCount: {
          hundreds: 0, fifties: 0, twenties: 0, tens: 0, fives: 0,
          ones: 0, quarters: 0, dimes: 0, nickels: 0, pennies: 0, totalCounted: 0
        },
        actualCashTotal: 0,
        variance: 0
      },
      paymentData: await this.calculatePaymentTotals(data.outletId, data.shiftStart, data.shiftEnd)
    })

    return reconciliation.save()
  }

  // BANK RECONCILIATION
  async createBankReconciliation(data: {
    outletId: string
    performedBy: string
    statementDate: Date
    statementBalance: number
    bookBalance: number
  }): Promise<Reconciliation> {
    const reconciliation = new this.reconciliationModel({
      type: ReconciliationType.BANK_RECONCILIATION,
      status: ReconciliationStatus.IN_PROGRESS,
      outletId: data.outletId,
      performedBy: data.performedBy,
      reconciliationDate: new Date(),
      bankData: {
        statementDate: data.statementDate,
        statementBalance: data.statementBalance,
        bookBalance: data.bookBalance,
        reconciledBalance: 0,
        variance: data.statementBalance - data.bookBalance,
        outstandingDeposits: [],
        outstandingWithdrawals: [],
        bankAdjustments: []
      }
    })

    return reconciliation.save()
  }

  async addBankReconciliationItem(reconciliationId: string, item: {
    type: 'deposit' | 'withdrawal' | 'adjustment'
    date: Date
    amount: number
    reference: string
    description: string
    adjustmentType?: 'fee' | 'interest' | 'charge' | 'credit'
  }): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationModel.findById(reconciliationId)
    
    if (!reconciliation || reconciliation.type !== ReconciliationType.BANK_RECONCILIATION) {
      throw new NotFoundException('Bank reconciliation not found')
    }

    switch (item.type) {
      case 'deposit':
        reconciliation.bankData.outstandingDeposits.push({
          date: item.date,
          amount: item.amount,
          reference: item.reference,
          description: item.description
        })
        break
      case 'withdrawal':
        reconciliation.bankData.outstandingWithdrawals.push({
          date: item.date,
          amount: item.amount,
          reference: item.reference,
          description: item.description
        })
        break
      case 'adjustment':
        reconciliation.bankData.bankAdjustments.push({
          date: item.date,
          amount: item.amount,
          type: item.adjustmentType,
          description: item.description
        })
        break
    }

    // Recalculate reconciled balance
    const outstandingDepositsTotal = reconciliation.bankData.outstandingDeposits
      .reduce((sum, dep) => sum + dep.amount, 0)
    const outstandingWithdrawalsTotal = reconciliation.bankData.outstandingWithdrawals
      .reduce((sum, wd) => sum + wd.amount, 0)
    const adjustmentsTotal = reconciliation.bankData.bankAdjustments
      .reduce((sum, adj) => sum + adj.amount, 0)

    reconciliation.bankData.reconciledBalance = 
      reconciliation.bankData.bookBalance + 
      outstandingDepositsTotal - 
      outstandingWithdrawalsTotal + 
      adjustmentsTotal

    reconciliation.bankData.variance = 
      reconciliation.bankData.statementBalance - reconciliation.bankData.reconciledBalance

    return reconciliation.save()
  }

  // INVENTORY RECONCILIATION
  async createInventoryReconciliation(data: {
    outletId: string
    performedBy: string
    productIds: string[]
  }): Promise<Reconciliation> {
    const products = await this.productModel.find({ 
      _id: { $in: data.productIds },
      outletId: data.outletId 
    })

    const inventoryItems = products.map(product => ({
      productId: product._id,
      productName: product.name,
      expectedQuantity: product.stockQuantity || 0,
      countedQuantity: 0,
      variance: 0,
      unitCost: product.costPrice || 0,
      varianceValue: 0,
      batchNumber: '',
      location: ''
    }))

    const reconciliation = new this.reconciliationModel({
      type: ReconciliationType.INVENTORY_COUNT,
      status: ReconciliationStatus.IN_PROGRESS,
      outletId: data.outletId,
      performedBy: data.performedBy,
      reconciliationDate: new Date(),
      inventoryItems
    })

    return reconciliation.save()
  }

  async updateInventoryCount(reconciliationId: string, updates: Array<{
    productId: string
    countedQuantity: number
    batchNumber?: string
    location?: string
    reason?: string
  }>): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationModel.findById(reconciliationId)
    
    if (!reconciliation || reconciliation.type !== ReconciliationType.INVENTORY_COUNT) {
      throw new NotFoundException('Inventory reconciliation not found')
    }

    // Update inventory counts
    updates.forEach(update => {
      const item = reconciliation.inventoryItems.find(
        item => item.productId.toString() === update.productId
      )
      
      if (item) {
        item.countedQuantity = update.countedQuantity
        item.variance = item.expectedQuantity - update.countedQuantity
        item.varianceValue = item.variance * item.unitCost
        item.batchNumber = update.batchNumber || item.batchNumber
        item.location = update.location || item.location
        item.reason = update.reason || item.reason
      }
    })

    // Calculate total variance
    reconciliation.totalVariance = reconciliation.inventoryItems
      .reduce((sum, item) => sum + Math.abs(item.varianceValue), 0)

    reconciliation.hasSignificantVariance = reconciliation.totalVariance > 100 // $100 threshold

    return reconciliation.save()
  }

  // GENERAL METHODS
  async findAll(filters: {
    outletId?: string
    type?: ReconciliationType
    status?: ReconciliationStatus
    startDate?: Date
    endDate?: Date
  }): Promise<Reconciliation[]> {
    const query: any = {}
    
    if (filters.outletId) query.outletId = filters.outletId
    if (filters.type) query.type = filters.type
    if (filters.status) query.status = filters.status
    
    if (filters.startDate || filters.endDate) {
      query.reconciliationDate = {}
      if (filters.startDate) query.reconciliationDate.$gte = filters.startDate
      if (filters.endDate) query.reconciliationDate.$lte = filters.endDate
    }

    return this.reconciliationModel
      .find(query)
      .populate('performedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .sort({ reconciliationDate: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationModel
      .findById(id)
      .populate('performedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('outletId', 'name address')
      .exec()

    if (!reconciliation) {
      throw new NotFoundException('Reconciliation not found')
    }

    return reconciliation
  }

  async approveReconciliation(id: string, approvedBy: string, notes?: string): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationModel.findById(id)
    
    if (!reconciliation) {
      throw new NotFoundException('Reconciliation not found')
    }

    if (reconciliation.status !== ReconciliationStatus.COMPLETED) {
      throw new BadRequestException('Reconciliation must be completed before approval')
    }

    reconciliation.status = ReconciliationStatus.APPROVED
    reconciliation.approvedBy = new Types.ObjectId(approvedBy)
    reconciliation.approvedAt = new Date()
    if (notes) reconciliation.managerNotes = notes

    reconciliation.auditTrail.push({
      action: 'approved',
      performedBy: new Types.ObjectId(approvedBy),
      timestamp: new Date(),
      details: `Reconciliation approved${notes ? `: ${notes}` : ''}`
    })

    return reconciliation.save()
  }

  async getReconciliationSummary(outletId: string, startDate: Date, endDate: Date) {
    const reconciliations = await this.reconciliationModel
      .find({
        outletId,
        reconciliationDate: { $gte: startDate, $lte: endDate }
      })
      .exec()

    const summary = {
      totalReconciliations: reconciliations.length,
      byType: {},
      byStatus: {},
      totalVariance: 0,
      significantVariances: 0,
      avgVariance: 0
    }

    reconciliations.forEach(recon => {
      // Count by type
      summary.byType[recon.type] = (summary.byType[recon.type] || 0) + 1
      
      // Count by status
      summary.byStatus[recon.status] = (summary.byStatus[recon.status] || 0) + 1
      
      // Sum variances
      if (recon.totalVariance) {
        summary.totalVariance += recon.totalVariance
      }
      
      if (recon.hasSignificantVariance) {
        summary.significantVariances++
      }
    })

    summary.avgVariance = summary.totalVariance / reconciliations.length || 0

    return summary
  }

  // HELPER METHODS
  private async calculateDailySalesData(outletId: string, startDate: Date, endDate: Date) {
    const sales = await this.saleModel
      .find({
        outletId,
        createdAt: { $gte: startDate, $lte: endDate }
      })
      .exec()

    let cashSales = 0
    let cashRefunds = 0
    let cashPayouts = 0

    sales.forEach(sale => {
      if (sale.paymentMethod === 'cash') {
        if (sale.total > 0) {
          cashSales += sale.total
        } else {
          cashRefunds += Math.abs(sale.total)
        }
      }
    })

    return { cashSales, cashRefunds, cashPayouts }
  }

  private async calculatePaymentTotals(outletId: string, startDate: Date, endDate: Date): Promise<PaymentReconciliationData> {
    const sales = await this.saleModel
      .find({
        outletId,
        createdAt: { $gte: startDate, $lte: endDate }
      })
      .exec()

    const totals = {
      cash: 0,
      creditCard: 0,
      debitCard: 0,
      check: 0,
      giftCard: 0,
      insurance: 0,
      other: 0
    }

    sales.forEach(sale => {
      const method = sale.paymentMethod
      const amount = sale.total

      switch (method) {
        case PaymentMethod.CASH:
          totals.cash += amount
          break
        case PaymentMethod.CARD:
          totals.creditCard += amount
          break
        case PaymentMethod.MOBILE:
          totals.debitCard += amount
          break
        case PaymentMethod.INSURANCE:
          totals.insurance += amount
          break
        default:
          totals.other += amount
          break
      }
    })

    return {
      expectedTotals: totals,
      actualTotals: { ...totals }, // Will be updated when actual amounts are entered
      variances: {
        cash: 0,
        creditCard: 0,
        debitCard: 0,
        check: 0,
        giftCard: 0,
        insurance: 0,
        other: 0
      },
      creditCardBatches: []
    }
  }
}