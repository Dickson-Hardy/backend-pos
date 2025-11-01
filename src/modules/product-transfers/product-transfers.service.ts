import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { ProductTransfer, ProductTransferDocument, TransferStatus } from "../../schemas/product-transfer.schema"
import { Product, ProductDocument } from "../../schemas/product.schema"
import { WebsocketGateway } from "../websocket/websocket.gateway"
import { CreateTransferDto } from "./dto/create-transfer.dto"

@Injectable()
export class ProductTransfersService {
  constructor(
    @InjectModel(ProductTransfer.name) private transferModel: Model<ProductTransferDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createDto: CreateTransferDto, userId: string): Promise<ProductTransfer> {
    if (createDto.fromOutletId === createDto.toOutletId) {
      throw new BadRequestException("Cannot transfer to the same outlet")
    }

    // Validate stock availability
    for (const item of createDto.items) {
      const product = await this.productModel.findOne({
        _id: new Types.ObjectId(item.productId),
        outletId: new Types.ObjectId(createDto.fromOutletId)
      })

      if (!product) {
        throw new NotFoundException(`Product ${item.productName} not found in source outlet`)
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.productName}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        )
      }
    }

    const transferNumber = await this.generateTransferNumber()

    const transfer = new this.transferModel({
      ...createDto,
      transferNumber,
      fromOutletId: new Types.ObjectId(createDto.fromOutletId),
      toOutletId: new Types.ObjectId(createDto.toOutletId),
      initiatedBy: new Types.ObjectId(userId),
      items: createDto.items.map(item => ({
        ...item,
        productId: new Types.ObjectId(item.productId)
      }))
    })

    return transfer.save()
  }

  async approve(id: string, userId: string): Promise<ProductTransfer> {
    const transfer = await this.transferModel.findById(id)
    if (!transfer) throw new NotFoundException("Transfer not found")
    if (transfer.status !== TransferStatus.PENDING) {
      throw new BadRequestException("Transfer already processed")
    }

    // Deduct stock from source outlet
    for (const item of transfer.items) {
      await this.productModel.findOneAndUpdate(
        { _id: item.productId, outletId: transfer.fromOutletId },
        { $inc: { stockQuantity: -item.quantity } }
      )
    }

    transfer.status = TransferStatus.IN_TRANSIT
    transfer.approvedBy = new Types.ObjectId(userId)
    transfer.approvedAt = new Date()
    return transfer.save()
  }

  async complete(id: string, userId: string): Promise<ProductTransfer> {
    const transfer = await this.transferModel.findById(id)
    if (!transfer) throw new NotFoundException("Transfer not found")
    if (transfer.status !== TransferStatus.IN_TRANSIT) {
      throw new BadRequestException("Transfer must be in transit")
    }

    // Add stock to destination outlet or create product if doesn't exist
    for (const item of transfer.items) {
      const sourceProduct = await this.productModel.findOne({
        _id: item.productId,
        outletId: transfer.fromOutletId
      })

      if (!sourceProduct) continue

      const destProduct = await this.productModel.findOne({
        name: sourceProduct.name,
        sku: sourceProduct.sku,
        outletId: transfer.toOutletId
      })

      if (destProduct) {
        // Product exists, update stock
        await this.productModel.findByIdAndUpdate(destProduct._id, {
          $inc: { stockQuantity: item.quantity }
        })
      } else {
        // Create new product in destination outlet
        const newProduct = new this.productModel({
          ...sourceProduct.toObject(),
          _id: undefined,
          outletId: transfer.toOutletId,
          stockQuantity: item.quantity,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await newProduct.save()
      }
    }

    transfer.status = TransferStatus.COMPLETED
    transfer.receivedBy = new Types.ObjectId(userId)
    transfer.receivedAt = new Date()
    const savedTransfer = await transfer.save()
    
    // Emit WebSocket events to both outlets
    this.websocketGateway.emitToOutlet(transfer.fromOutletId.toString(), 'transfer:completed', { transferId: savedTransfer._id })
    this.websocketGateway.emitToOutlet(transfer.toOutletId.toString(), 'transfer:completed', { transferId: savedTransfer._id })
    
    return savedTransfer
  }

  async cancel(id: string): Promise<ProductTransfer> {
    const transfer = await this.transferModel.findById(id)
    if (!transfer) throw new NotFoundException("Transfer not found")
    if (transfer.status === TransferStatus.COMPLETED) {
      throw new BadRequestException("Cannot cancel completed transfer")
    }

    // If in transit, restore stock to source outlet
    if (transfer.status === TransferStatus.IN_TRANSIT) {
      for (const item of transfer.items) {
        await this.productModel.findOneAndUpdate(
          { _id: item.productId, outletId: transfer.fromOutletId },
          { $inc: { stockQuantity: item.quantity } }
        )
      }
    }

    transfer.status = TransferStatus.CANCELLED
    return transfer.save()
  }

  async findAll(outletId?: string, status?: string): Promise<ProductTransfer[]> {
    const filter: any = {}
    
    if (outletId) {
      filter.$or = [
        { fromOutletId: new Types.ObjectId(outletId) },
        { toOutletId: new Types.ObjectId(outletId) }
      ]
    }
    
    if (status) filter.status = status

    return this.transferModel
      .find(filter)
      .populate("fromOutletId toOutletId initiatedBy approvedBy receivedBy")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<ProductTransfer> {
    const transfer = await this.transferModel
      .findById(id)
      .populate("fromOutletId toOutletId initiatedBy approvedBy receivedBy")
      .exec()
    
    if (!transfer) throw new NotFoundException("Transfer not found")
    return transfer
  }

  async getStats(outletId?: string) {
    const filter: any = {}
    if (outletId) {
      filter.$or = [
        { fromOutletId: new Types.ObjectId(outletId) },
        { toOutletId: new Types.ObjectId(outletId) }
      ]
    }

    const stats = await this.transferModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalTransfers: { $sum: 1 },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          inTransitCount: { $sum: { $cond: [{ $eq: ["$status", "in_transit"] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        }
      }
    ])

    return stats[0] || {
      totalTransfers: 0,
      pendingCount: 0,
      inTransitCount: 0,
      completedCount: 0,
      cancelledCount: 0,
    }
  }

  private async generateTransferNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.transferModel.countDocuments({
      transferNumber: { $regex: `^TRF-${year}-` }
    })
    return `TRF-${year}-${String(count + 1).padStart(4, '0')}`
  }
}
