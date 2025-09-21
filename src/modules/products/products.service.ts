import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Product, type ProductDocument } from "../../schemas/product.schema"
import { Batch, type BatchDocument } from "../../schemas/batch.schema"
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema"
import type { CreateProductDto } from "./dto/create-product.dto"
import type { UpdateProductDto } from "./dto/update-product.dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(PackVariant.name) private packVariantModel: Model<PackVariantDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { packVariants, ...productData } = createProductDto
    
    // Create the product first
    const product = new this.productModel(productData)
    const savedProduct = await product.save()
    
    // Create pack variants if provided
    if (packVariants && packVariants.length > 0) {
      const packVariantDocs = packVariants.map(variant => ({
        ...variant,
        productId: savedProduct._id,
      }))
      await this.packVariantModel.insertMany(packVariantDocs)
    }
    
    // Return the product with populated pack variants
    return this.findOne(savedProduct._id.toString())
  }

  async findAll(outletId?: string): Promise<Product[]> {
    const filter = outletId ? { outletId } : {}
    return this.productModel
      .find(filter)
      .populate("outletId")
      .populate("packVariants")
      .exec()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate("outletId")
      .populate("packVariants")
      .exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { packVariants, ...productData } = updateProductDto
    
    // Update the product
    const product = await this.productModel.findByIdAndUpdate(id, productData, { new: true }).exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    
    // Handle pack variants if provided
    if (packVariants !== undefined) {
      // Remove existing pack variants
      await this.packVariantModel.deleteMany({ productId: id }).exec()
      
      // Create new pack variants if provided
      if (packVariants.length > 0) {
        const packVariantDocs = packVariants.map(variant => ({
          ...variant,
          productId: id,
        }))
        await this.packVariantModel.insertMany(packVariantDocs)
      }
    }
    
    // Return the updated product with populated pack variants
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Product not found")
    }
    
    // Also remove associated pack variants
    await this.packVariantModel.deleteMany({ productId: id }).exec()
  }

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productModel.findOne({ barcode }).exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  async findLowStock(outletId?: string): Promise<Product[]> {
    const filter: any = {
      $expr: { $lte: ["$stockQuantity", "$reorderLevel"] },
    }
    if (outletId) {
      filter.outletId = outletId
    }
    return this.productModel.find(filter).exec()
  }

  async search(query: string): Promise<Product[]> {
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { genericName: { $regex: query, $options: "i" } },
        { manufacturer: { $regex: query, $options: "i" } },
        { sku: { $regex: query, $options: "i" } },
        { barcode: { $regex: query, $options: "i" } },
      ],
    }
    return this.productModel.find(searchFilter).exec()
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(productId, { $inc: { stockQuantity: quantity } }, { new: true })
      .exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }
  
  // Pack variant utility methods
  async getPackVariants(productId: string): Promise<PackVariant[]> {
    return this.packVariantModel.find({ productId }).exec()
  }
  
  async calculatePackInventory(totalUnits: number, packVariants: PackVariant[]): Promise<{
    packBreakdown: Array<{ variant: PackVariant; availablePacks: number }>
    looseUnits: number
    totalValue: number
  }> {
    // Sort pack variants by size (largest first) for optimal packing
    const sortedVariants = packVariants
      .filter(v => v.isActive)
      .sort((a, b) => b.packSize - a.packSize)
    
    let remainingUnits = totalUnits
    const packBreakdown: Array<{ variant: PackVariant; availablePacks: number }> = []
    let totalValue = 0

    // Calculate how many of each pack size can be made
    for (const variant of sortedVariants) {
      const availablePacks = Math.floor(remainingUnits / variant.packSize)
      if (availablePacks > 0) {
        packBreakdown.push({ variant, availablePacks })
        const unitsUsed = availablePacks * variant.packSize
        remainingUnits -= unitsUsed
        totalValue += availablePacks * variant.packPrice
      }
    }

    // Add value of loose units
    totalValue += remainingUnits * (sortedVariants[0]?.unitPrice || 0)

    return {
      packBreakdown,
      looseUnits: remainingUnits,
      totalValue
    }
  }
}
