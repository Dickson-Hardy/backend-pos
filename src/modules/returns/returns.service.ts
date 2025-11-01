import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Return, ReturnDocument, ReturnStatus } from "../../schemas/return.schema"
import { Product, ProductDocument } from "../../schemas/product.schema"
import { WebsocketGateway } from "../websocket/websocket.gateway"
import { CreateReturnDto } from "./dto/create-return.dto"

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(Return.name) private returnModel: Model<ReturnDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createDto: CreateReturnDto, userId: string): Promise<Return> {
    const returnNumber = await this.generateReturnNumber()
    
    const returnDoc = new this.returnModel({
      ...createDto,
      returnNumber,
      originalSaleId: new Types.ObjectId(createDto.originalSaleId),
      outletId: new Types.ObjectId(createDto.outletId),
      processedBy: new Types.ObjectId(userId),
      items: createDto.items.map(item => ({
        ...item,
        productId: new Types.ObjectId(item.productId)
      }))
    })

    return returnDoc.save()
  }

  async approve(id: string, userId: string): Promise<Return> {
    const returnDoc = await this.returnModel.findById(id)
    if (!returnDoc) throw new NotFoundException("Return not found")
    if (returnDoc.status !== ReturnStatus.PENDING) {
      throw new BadRequestException("Return already processed")
    }

    returnDoc.status = ReturnStatus.APPROVED
    returnDoc.approvedBy = new Types.ObjectId(userId)
    returnDoc.approvedAt = new Date()

    const savedReturn = await returnDoc.save()
    
    // Emit WebSocket event
    this.websocketGateway.emitToOutlet(returnDoc.outletId.toString(), 'return:approved', {
      returnId: savedReturn._id,
      productIds: savedReturn.items.map(item => item.productId.toString()),
      totalRefund: savedReturn.totalRefundAmount
    })
    
    return savedReturn
  }

  async reject(id: string, userId: string): Promise<Return> {
    const returnDoc = await this.returnModel.findById(id)
    if (!returnDoc) throw new NotFoundException("Return not found")
    if (returnDoc.status !== ReturnStatus.PENDING) {
      throw new BadRequestException("Return already processed")
    }

    returnDoc.status = ReturnStatus.REJECTED
    returnDoc.approvedBy = new Types.ObjectId(userId)
    returnDoc.approvedAt = new Date()

    return returnDoc.save()
  }

  async restockInventory(id: string): Promise<Return> {
    const returnDoc = await this.returnModel.findById(id)
    if (!returnDoc) throw new NotFoundException("Return not found")
    if (returnDoc.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException("Return must be approved first")
    }
    if (returnDoc.restockedToInventory) {
      throw new BadRequestException("Already restocked")
    }

    for (const item of returnDoc.items) {
      await this.productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      )
    }

    returnDoc.restockedToInventory = true
    returnDoc.status = ReturnStatus.COMPLETED
    const savedReturn = await returnDoc.save()
    
    // Emit WebSocket event for inventory update
    this.websocketGateway.emitToOutlet(returnDoc.outletId.toString(), 'return:restocked', {
      returnId: savedReturn._id,
      productIds: savedReturn.items.map(item => item.productId.toString())
    })
    
    return savedReturn
  }

  async findAll(outletId?: string, status?: string): Promise<Return[]> {
    const filter: any = {}
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    if (status) filter.status = status

    return this.returnModel
      .find(filter)
      .populate("originalSaleId processedBy approvedBy")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Return> {
    const returnDoc = await this.returnModel
      .findById(id)
      .populate("originalSaleId processedBy approvedBy")
      .exec()
    
    if (!returnDoc) throw new NotFoundException("Return not found")
    return returnDoc
  }

  async getReturnStats(outletId?: string) {
    const filter: any = {}
    if (outletId) filter.outletId = new Types.ObjectId(outletId)

    const stats = await this.returnModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
          totalRefundAmount: { $sum: "$totalRefundAmount" },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          approvedCount: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          rejectedCount: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        }
      }
    ])

    return stats[0] || {
      totalReturns: 0,
      totalRefundAmount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      completedCount: 0,
    }
  }

  private async generateReturnNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.returnModel.countDocuments({
      returnNumber: { $regex: `^RET-${year}-` }
    })
    return `RET-${year}-${String(count + 1).padStart(4, '0')}`
  }
}
