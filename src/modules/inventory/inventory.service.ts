import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { InventoryAdjustment, type InventoryAdjustmentDocument } from "../../schemas/inventory-adjustment.schema"
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema"
import { Batch, type BatchDocument } from "../../schemas/batch.schema"
import { ProductsService } from "../products/products.service"
import { PackUtils } from "../../utils/pack-utils"
import type { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto"
import type { EnhancedInventoryDto } from "./dto/enhanced-inventory.dto"

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryAdjustment.name) private inventoryAdjustmentModel: Model<InventoryAdjustmentDocument>,
    @InjectModel(PackVariant.name) private packVariantModel: Model<PackVariantDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    private productsService: ProductsService,
  ) {}

  async adjustInventory(createAdjustmentDto: CreateInventoryAdjustmentDto): Promise<InventoryAdjustment> {
    console.log('=== INVENTORY ADJUSTMENT START ===')
    console.log('Received DTO:', createAdjustmentDto)
    
    const product = await this.productsService.findOne(createAdjustmentDto.productId)
    console.log('Found product:', product?.name, 'Current stock:', product?.stockQuantity)

    // Validate ObjectId formats before conversion
    const isValidObjectId = (id: string): boolean => {
      return /^[0-9a-fA-F]{24}$/.test(id)
    }

    if (!isValidObjectId(createAdjustmentDto.productId)) {
      throw new Error(`Invalid productId format: ${createAdjustmentDto.productId}`)
    }
    if (!isValidObjectId(createAdjustmentDto.outletId)) {
      throw new Error(`Invalid outletId format: ${createAdjustmentDto.outletId}`)
    }
    if (!isValidObjectId(createAdjustmentDto.adjustedBy)) {
      throw new Error(`Invalid adjustedBy format: ${createAdjustmentDto.adjustedBy}`)
    }

    const adjustment = new this.inventoryAdjustmentModel({
      productId: new Types.ObjectId(createAdjustmentDto.productId),
      outletId: new Types.ObjectId(createAdjustmentDto.outletId),
      adjustedBy: new Types.ObjectId(createAdjustmentDto.adjustedBy),
      adjustedQuantity: createAdjustmentDto.adjustedQuantity,
      reason: createAdjustmentDto.reason,
      type: createAdjustmentDto.type,
      notes: createAdjustmentDto.notes,
      previousQuantity: product.stockQuantity,
      newQuantity: product.stockQuantity + createAdjustmentDto.adjustedQuantity,
    })

    console.log('Created adjustment object:', adjustment)
    const savedAdjustment = await adjustment.save()
    console.log('Saved adjustment:', savedAdjustment._id)

    // Update product stock
    console.log('Updating product stock...')
    await this.productsService.updateStock(createAdjustmentDto.productId, createAdjustmentDto.adjustedQuantity)
    
    // Verify the update
    const updatedProduct = await this.productsService.findOne(createAdjustmentDto.productId)
    console.log('Updated product stock:', updatedProduct?.stockQuantity)
    console.log('=== INVENTORY ADJUSTMENT END ===')

    return savedAdjustment
  }

  async getAdjustmentHistory(outletId?: string, productId?: string): Promise<InventoryAdjustment[]> {
    const filter: any = {}
    if (outletId) filter.outletId = outletId
    if (productId) filter.productId = productId

    return this.inventoryAdjustmentModel
      .find(filter)
      .populate("productId")
      .populate("adjustedBy")
      .sort({ adjustmentDate: -1 })
      .exec()
  }

  async getEnhancedInventory(outletId?: string): Promise<EnhancedInventoryDto[]> {
    const products = await this.productsService.findAll(outletId)
    const enhancedInventory: EnhancedInventoryDto[] = []

    for (const product of products) {
      const productDoc = product as any // Cast to access _id
      const packVariants = await this.packVariantModel.find({ productId: productDoc._id }).exec()
      const breakdown = PackUtils.calculatePackInventory(product.stockQuantity, packVariants)

      enhancedInventory.push({
        productId: productDoc._id.toString(),
        productName: product.name,
        totalUnits: product.stockQuantity,
        packBreakdown: breakdown.packBreakdown,
        looseUnits: breakdown.looseUnits,
        totalValue: breakdown.totalValue,
        formattedDisplay: PackUtils.formatInventoryDisplay(product.stockQuantity, packVariants),
        reorderLevel: product.reorderLevel,
        maxStockLevel: product.maxStockLevel,
        needsReorder: product.stockQuantity <= product.reorderLevel,
      })
    }

    return enhancedInventory
  }

  async getProductPackInfo(productId: string): Promise<{
    totalUnits: number
    packBreakdown: any[]
    looseUnits: number
    formattedDisplay: string
  }> {
    const product = await this.productsService.findOne(productId)
    const packVariants = await this.packVariantModel.find({ productId }).exec()
    
    const breakdown = PackUtils.calculatePackInventory(product.stockQuantity, packVariants)
    
    return {
      totalUnits: product.stockQuantity,
      packBreakdown: breakdown.packBreakdown,
      looseUnits: breakdown.looseUnits,
      formattedDisplay: PackUtils.formatInventoryDisplay(product.stockQuantity, packVariants),
    }
  }

  // Inventory item updates (reorder/max levels live on Product)
  async updateInventoryItem(productId: string, update: { reorderLevel?: number; maxStockLevel?: number }) {
    const product = await this.productsService.update(productId, update as any)
    return product
  }

  // Batch CRUD
  async listBatches(outletId?: string, productId?: string) {
    const filter: any = {}
    if (outletId) filter.outletId = outletId
    if (productId) filter.productId = productId
    return this.batchModel.find(filter).exec()
  }

  async getBatch(id: string) {
    const batch = await this.batchModel.findById(id).exec()
    if (!batch) throw new NotFoundException('Batch not found')
    return batch
  }

  async createBatch(dto: {
    batchNumber: string
    productId: string
    outletId: string
    manufacturingDate: string
    expiryDate: string
    quantity: number
    costPrice: number
    sellingPrice: number
    supplierName?: string
    supplierInvoice?: string
    notes?: string
  }) {
    const batch = new this.batchModel({
      ...dto,
      manufacturingDate: new Date(dto.manufacturingDate),
      expiryDate: new Date(dto.expiryDate),
    })
    return batch.save()
  }

  async updateBatch(id: string, dto: Partial<{
    batchNumber: string
    manufacturingDate: string
    expiryDate: string
    quantity: number
    soldQuantity: number
    costPrice: number
    sellingPrice: number
    status: string
    supplierName?: string
    supplierInvoice?: string
    notes?: string
  }>) {
    const update: any = { ...dto }
    if (dto.manufacturingDate) update.manufacturingDate = new Date(dto.manufacturingDate)
    if (dto.expiryDate) update.expiryDate = new Date(dto.expiryDate)
    const batch = await this.batchModel.findByIdAndUpdate(id, update, { new: true }).exec()
    if (!batch) throw new NotFoundException('Batch not found')
    return batch
  }

  async deleteBatch(id: string) {
    const res = await this.batchModel.findByIdAndDelete(id).exec()
    if (!res) throw new NotFoundException('Batch not found')
    return { success: true }
  }
}
