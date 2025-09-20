import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Product, type ProductDocument } from "../../schemas/product.schema"
import { Batch, type BatchDocument } from "../../schemas/batch.schema"
import type { CreateProductDto } from "./dto/create-product.dto"
import type { UpdateProductDto } from "./dto/update-product.dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto)
    return product.save()
  }

  async findAll(outletId?: string): Promise<Product[]> {
    const filter = outletId ? { outletId } : {}
    return this.productModel.find(filter).populate("outletId").exec()
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate("outletId").exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec()
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Product not found")
    }
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
}
