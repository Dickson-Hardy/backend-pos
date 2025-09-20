import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { PurchaseOrder, type PurchaseOrderDocument, PurchaseOrderStatus } from "../../schemas/purchase-order.schema"
import type { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto"
import type { UpdatePurchaseOrderDto } from "./dto/update-purchase-order.dto"

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectModel(PurchaseOrder.name) private purchaseOrderModel: Model<PurchaseOrderDocument>,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto, userId: string): Promise<PurchaseOrder> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber()

    const purchaseOrder = new this.purchaseOrderModel({
      ...createPurchaseOrderDto,
      orderNumber,
      createdBy: userId,
      status: PurchaseOrderStatus.DRAFT,
    })

    return purchaseOrder.save()
  }

  async findAll(outletId?: string): Promise<PurchaseOrder[]> {
    const filter: any = {}
    if (outletId) filter.outletId = outletId

    return this.purchaseOrderModel
      .find(filter)
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderModel
      .findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode price")
      .exec()

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }

    return purchaseOrder
  }

  async update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const updatedOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(id, updatePurchaseOrderDto, { new: true })
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode")
      .exec()

    if (!updatedOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }

    return updatedOrder
  }

  async approve(id: string, userId: string): Promise<PurchaseOrder> {
    const updatedOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(
        id,
        {
          status: PurchaseOrderStatus.APPROVED,
          approvedBy: userId,
          approvedAt: new Date(),
        },
        { new: true }
      )
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode")
      .exec()

    if (!updatedOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }

    return updatedOrder
  }

  async cancel(id: string): Promise<PurchaseOrder> {
    const updatedOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(
        id,
        { status: PurchaseOrderStatus.CANCELLED },
        { new: true }
      )
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode")
      .exec()

    if (!updatedOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }

    return updatedOrder
  }

  async markAsDelivered(id: string, actualDeliveryDate?: string): Promise<PurchaseOrder> {
    const updatedOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(
        id,
        {
          status: PurchaseOrderStatus.DELIVERED,
          actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : new Date(),
        },
        { new: true }
      )
      .populate("createdBy", "firstName lastName email")
      .populate("approvedBy", "firstName lastName email")
      .populate("items.productId", "name barcode")
      .exec()

    if (!updatedOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }

    return updatedOrder
  }

  async remove(id: string): Promise<void> {
    const result = await this.purchaseOrderModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`)
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.purchaseOrderModel.countDocuments({
      orderNumber: { $regex: `^PO-${year}-` }
    })
    
    return `PO-${year}-${String(count + 1).padStart(3, '0')}`
  }

  async getStatistics(outletId?: string): Promise<{
    total: number
    pending: number
    approved: number
    inTransit: number
    delivered: number
    cancelled: number
  }> {
    const filter: any = {}
    if (outletId) filter.outletId = outletId

    const [total, pending, approved, inTransit, delivered, cancelled] = await Promise.all([
      this.purchaseOrderModel.countDocuments(filter),
      this.purchaseOrderModel.countDocuments({ ...filter, status: PurchaseOrderStatus.PENDING }),
      this.purchaseOrderModel.countDocuments({ ...filter, status: PurchaseOrderStatus.APPROVED }),
      this.purchaseOrderModel.countDocuments({ ...filter, status: PurchaseOrderStatus.IN_TRANSIT }),
      this.purchaseOrderModel.countDocuments({ ...filter, status: PurchaseOrderStatus.DELIVERED }),
      this.purchaseOrderModel.countDocuments({ ...filter, status: PurchaseOrderStatus.CANCELLED }),
    ])

    return {
      total,
      pending,
      approved,
      inTransit,
      delivered,
      cancelled,
    }
  }
}