import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Types } from "mongoose"
import { Sale, type SaleDocument } from "../../schemas/sale.schema"
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema"
import { ProductsService } from "../products/products.service"
import { ShiftsService } from "../shifts/shifts.service"
import { WebsocketGateway } from "../websocket/websocket.gateway"
import type { CreateSaleDto } from "./dto/create-sale.dto"

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(PackVariant.name) private packVariantModel: Model<PackVariantDocument>,
    private productsService: ProductsService,
    private shiftsService: ShiftsService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Generate receipt number
    const receiptNumber = await this.generateReceiptNumber()

    // Process inventory deduction for each item
    for (const item of createSaleDto.items) {
      if (item.packInfo) {
        // Handle pack-based sales
        await this.processPackSale(item.productId.toString(), item.packInfo)
      } else {
        // Handle traditional unit-based sales
        await this.productsService.updateStock(item.productId.toString(), -item.quantity)
      }
    }

    // Convert string IDs to ObjectIds
    const saleData = {
      ...createSaleDto,
      receiptNumber,
      outletId: new Types.ObjectId(createSaleDto.outletId),
      cashierId: new Types.ObjectId(createSaleDto.cashierId),
    }

    const sale = new this.saleModel(saleData)
    const savedSale = await sale.save()

    // Update shift sales if cashier has an active shift
    try {
      const currentShift = await this.shiftsService.getCurrentShift(createSaleDto.cashierId)
      if (currentShift) {
        await this.shiftsService.updateShiftSales(currentShift._id.toString(), createSaleDto.total)
      }
    } catch (error) {
      // Log error but don't fail the sale if shift update fails
      console.error('Failed to update shift sales:', error)
    }

    // Emit WebSocket event
    this.websocketGateway.emitToOutlet(createSaleDto.outletId, 'sale:completed', {
      saleId: savedSale._id,
      total: savedSale.total,
      items: savedSale.items
    })

    return savedSale
  }

  private async processPackSale(productId: string, packInfo: any): Promise<void> {
    if (packInfo.saleType === 'pack' && packInfo.packVariantId) {
      // Validate pack variant exists and is active
      const packVariant = await this.packVariantModel.findById(packInfo.packVariantId).exec()
      if (!packVariant || !packVariant.isActive) {
        throw new BadRequestException('Invalid or inactive pack variant')
      }
      
      // Verify pack variant belongs to the product
      if (packVariant.productId.toString() !== productId) {
        throw new BadRequestException('Pack variant does not belong to the specified product')
      }
      
      // Calculate total units to deduct (pack quantity * pack size)
      const totalUnitsToDeduct = (packInfo.packQuantity || 0) * packVariant.packSize
      
      // Deduct from product stock
      await this.productsService.updateStock(productId, -totalUnitsToDeduct)
    } else if (packInfo.saleType === 'unit') {
      // Handle individual unit sales
      await this.productsService.updateStock(productId, -(packInfo.unitQuantity || 0))
    } else {
      // Use effectiveUnitCount as fallback
      await this.productsService.updateStock(productId, -packInfo.effectiveUnitCount)
    }
  }

  async findAll(outletId?: string, startDate?: Date, endDate?: Date, cashierId?: string, status?: string): Promise<Sale[]> {
    try {
      const filter: any = {}

      if (outletId && Types.ObjectId.isValid(outletId)) {
        filter.outletId = new Types.ObjectId(outletId)
      }

      if (cashierId && Types.ObjectId.isValid(cashierId)) {
        filter.cashierId = new Types.ObjectId(cashierId)
      }

      if (status && status.trim() !== '') {
        filter.status = status
      }

      if (startDate || endDate) {
        filter.saleDate = {}
        if (startDate) filter.saleDate.$gte = startDate
        if (endDate) filter.saleDate.$lte = endDate
      }

      const sales = await this.saleModel.find(filter).populate("outletId").populate("cashierId").sort({ saleDate: -1 }).exec()
      return sales
    } catch (error) {
      console.error('Error in findAll sales:', error)
      throw new BadRequestException('Failed to fetch sales data')
    }
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).populate("outletId").populate("cashierId").exec()

    if (!sale) {
      throw new NotFoundException("Sale not found")
    }

    return sale
  }

  async getDailySales(outletId?: string): Promise<any> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const filter: any = {
        saleDate: { $gte: today, $lt: tomorrow },
        status: "completed",
      }

      if (outletId) {
        filter.outletId = new Types.ObjectId(outletId)
      }

      const sales = await this.saleModel.find(filter).exec()

      const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
      const totalTransactions = sales.length

      return {
        totalSales,
        totalTransactions,
        sales,
      }
    } catch (error) {
      console.error('Error in getDailySales:', error)
      throw new BadRequestException('Failed to fetch daily sales data')
    }
  }

  async searchSales(query: string, outletId?: string): Promise<Sale[]> {
    const filter: any = {
      $or: [
        { receiptNumber: { $regex: query, $options: 'i' } },
        { customerName: { $regex: query, $options: 'i' } },
        { customerPhone: { $regex: query, $options: 'i' } },
      ]
    }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    
    return this.saleModel.find(filter).populate('cashierId outletId').limit(50).exec()
  }

  async getSalesByHour(outletId?: string, date?: Date): Promise<any> {
    const targetDate = date || new Date()
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    const filter: any = {
      saleDate: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)

    const hourlyData = await this.saleModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $hour: '$saleDate' },
          sales: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return hourlyData.map(h => ({ hour: h._id, sales: h.sales, count: h.count }))
  }

  async getSalesByCategory(outletId?: string, startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = { status: 'completed' }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    if (startDate || endDate) {
      filter.saleDate = {}
      if (startDate) filter.saleDate.$gte = startDate
      if (endDate) filter.saleDate.$lte = endDate
    }

    return this.saleModel.aggregate([
      { $match: filter },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          sales: { $sum: '$items.totalPrice' },
          quantity: { $sum: '$items.quantity' }
        }
      }
    ])
  }

  async getCashierPerformance(outletId?: string, startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = { status: 'completed' }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    if (startDate || endDate) {
      filter.saleDate = {}
      if (startDate) filter.saleDate.$gte = startDate
      if (endDate) filter.saleDate.$lte = endDate
    }

    return this.saleModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$cashierId',
          totalSales: { $sum: '$total' },
          transactionCount: { $sum: 1 },
          averageTransaction: { $avg: '$total' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'cashier'
        }
      },
      { $unwind: '$cashier' },
      { $sort: { totalSales: -1 } }
    ])
  }

  async getPaymentMethodBreakdown(outletId?: string, startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = { status: 'completed' }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    if (startDate || endDate) {
      filter.saleDate = {}
      if (startDate) filter.saleDate.$gte = startDate
      if (endDate) filter.saleDate.$lte = endDate
    }

    return this.saleModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ])
  }

  async getSalesComparison(outletId?: string): Promise<any> {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const filter: any = { status: 'completed' }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)

    const [todaySales, yesterdaySales, thisWeekSales, lastWeekSales] = await Promise.all([
      this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: yesterday, $lt: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      this.saleModel.aggregate([{ $match: { ...filter, saleDate: { $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000), $lt: weekAgo } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }])
    ])

    return {
      today: todaySales[0] || { total: 0, count: 0 },
      yesterday: yesterdaySales[0] || { total: 0, count: 0 },
      thisWeek: thisWeekSales[0] || { total: 0, count: 0 },
      lastWeek: lastWeekSales[0] || { total: 0, count: 0 }
    }
  }

  private async generateReceiptNumber(): Promise<string> {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")

    const lastSale = await this.saleModel
      .findOne({ receiptNumber: { $regex: `^${dateStr}` } })
      .sort({ receiptNumber: -1 })
      .exec()

    let sequence = 1
    if (lastSale) {
      const lastSequence = Number.parseInt(lastSale.receiptNumber.slice(-4))
      sequence = lastSequence + 1
    }

    return `${dateStr}${sequence.toString().padStart(4, "0")}`
  }
}
