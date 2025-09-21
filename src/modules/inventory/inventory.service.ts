import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { InventoryAdjustment, type InventoryAdjustmentDocument } from "../../schemas/inventory-adjustment.schema"
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema"
import { ProductsService } from "../products/products.service"
import { PackUtils } from "../../utils/pack-utils"
import type { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto"
import type { EnhancedInventoryDto } from "./dto/enhanced-inventory.dto"

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryAdjustment.name) private inventoryAdjustmentModel: Model<InventoryAdjustmentDocument>,
    @InjectModel(PackVariant.name) private packVariantModel: Model<PackVariantDocument>,
    private productsService: ProductsService,
  ) {}

  async adjustInventory(createAdjustmentDto: CreateInventoryAdjustmentDto): Promise<InventoryAdjustment> {
    const product = await this.productsService.findOne(createAdjustmentDto.productId)

    const adjustment = new this.inventoryAdjustmentModel({
      ...createAdjustmentDto,
      previousQuantity: product.stockQuantity,
      newQuantity: product.stockQuantity + createAdjustmentDto.adjustedQuantity,
    })

    await adjustment.save()

    // Update product stock
    await this.productsService.updateStock(createAdjustmentDto.productId, createAdjustmentDto.adjustedQuantity)

    return adjustment
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
}
