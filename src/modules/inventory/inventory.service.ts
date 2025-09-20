import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { InventoryAdjustment, type InventoryAdjustmentDocument } from "../../schemas/inventory-adjustment.schema"
import { ProductsService } from "../products/products.service"
import type { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto"

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryAdjustment.name) private inventoryAdjustmentModel: Model<InventoryAdjustmentDocument>,
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
}
