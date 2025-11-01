import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Supplier, SupplierDocument } from "../../schemas/supplier.schema"
import { CreateSupplierDto } from "./dto/create-supplier.dto"
import { UpdateSupplierDto } from "./dto/update-supplier.dto"

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      const supplier = new this.supplierModel({
        ...createSupplierDto,
        outletId: new Types.ObjectId(createSupplierDto.outletId),
      })
      return await supplier.save()
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("Supplier with this name already exists for this outlet")
      }
      throw error
    }
  }

  async findAll(outletId?: string, status?: string): Promise<Supplier[]> {
    const filter: any = {}
    
    if (outletId) {
      filter.outletId = new Types.ObjectId(outletId)
    }
    
    if (status) {
      filter.status = status
    }

    return await this.supplierModel
      .find(filter)
      .sort({ name: 1 })
      .exec()
  }

  async findOne(id: string): Promise<Supplier> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    const supplier = await this.supplierModel.findById(id).exec()
    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }
    return supplier
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    try {
      const updateData: any = { ...updateSupplierDto }
      if (updateSupplierDto.outletId) {
        updateData.outletId = new Types.ObjectId(updateSupplierDto.outletId)
      }

      const supplier = await this.supplierModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec()

      if (!supplier) {
        throw new NotFoundException("Supplier not found")
      }
      return supplier
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("Supplier with this name already exists for this outlet")
      }
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    const result = await this.supplierModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Supplier not found")
    }
  }

  async updateRating(id: string, rating: number): Promise<Supplier> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    const supplier = await this.supplierModel
      .findByIdAndUpdate(
        id,
        { rating: Math.max(0, Math.min(5, rating)) },
        { new: true }
      )
      .exec()

    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }
    return supplier
  }

  async updateLastOrder(id: string, orderDate: Date): Promise<Supplier> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    const supplier = await this.supplierModel
      .findByIdAndUpdate(
        id,
        { lastOrder: orderDate },
        { new: true }
      )
      .exec()

    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }
    return supplier
  }

  async incrementProductsSupplied(id: string, count: number = 1): Promise<Supplier> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid supplier ID")
    }

    const supplier = await this.supplierModel
      .findByIdAndUpdate(
        id,
        { $inc: { productsSupplied: count } },
        { new: true }
      )
      .exec()

    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }
    return supplier
  }

  async getSupplierStats(outletId?: string): Promise<any> {
    const filter: any = {}
    if (outletId) {
      filter.outletId = new Types.ObjectId(outletId)
    }

    const stats = await this.supplierModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSuppliers: { $sum: 1 },
          activeSuppliers: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          },
          inactiveSuppliers: {
            $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] }
          },
          suspendedSuppliers: {
            $sum: { $cond: [{ $eq: ["$status", "suspended"] }, 1, 0] }
          },
          averageRating: { $avg: "$rating" },
          totalProductsSupplied: { $sum: "$productsSupplied" }
        }
      }
    ])

    return stats[0] || {
      totalSuppliers: 0,
      activeSuppliers: 0,
      inactiveSuppliers: 0,
      suspendedSuppliers: 0,
      averageRating: 0,
      totalProductsSupplied: 0
    }
  }
}