import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Sale, type SaleDocument } from "../../schemas/sale.schema"
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema"
import { ProductsService } from "../products/products.service"
import type { CreateSaleDto } from "./dto/create-sale.dto"

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(PackVariant.name) private packVariantModel: Model<PackVariantDocument>,
    private productsService: ProductsService,
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

    const sale = new this.saleModel({
      ...createSaleDto,
      receiptNumber,
    })

    return sale.save()
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

  async findAll(outletId?: string, startDate?: Date, endDate?: Date): Promise<Sale[]> {
    const filter: any = {}

    if (outletId) {
      filter.outletId = outletId
    }

    if (startDate || endDate) {
      filter.saleDate = {}
      if (startDate) filter.saleDate.$gte = startDate
      if (endDate) filter.saleDate.$lte = endDate
    }

    return this.saleModel.find(filter).populate("outletId").populate("cashierId").sort({ saleDate: -1 }).exec()
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).populate("outletId").populate("cashierId").exec()

    if (!sale) {
      throw new NotFoundException("Sale not found")
    }

    return sale
  }

  async getDailySales(outletId?: string): Promise<any> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const filter: any = {
      saleDate: { $gte: today, $lt: tomorrow },
      status: "completed",
    }

    if (outletId) {
      filter.outletId = outletId
    }

    const sales = await this.saleModel.find(filter).exec()

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTransactions = sales.length

    return {
      totalSales,
      totalTransactions,
      sales,
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
