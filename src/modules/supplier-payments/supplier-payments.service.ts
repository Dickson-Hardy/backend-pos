import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { SupplierPayment, SupplierPaymentDocument, PaymentStatus } from "../../schemas/supplier-payment.schema"
import { CreateSupplierPaymentDto } from "./dto/create-supplier-payment.dto"
import { RecordPaymentDto } from "./dto/record-payment.dto"

@Injectable()
export class SupplierPaymentsService {
  constructor(
    @InjectModel(SupplierPayment.name) private paymentModel: Model<SupplierPaymentDocument>
  ) {}

  async create(createDto: CreateSupplierPaymentDto, userId: string): Promise<SupplierPayment> {
    const paymentNumber = await this.generatePaymentNumber()
    
    const payment = new this.paymentModel({
      ...createDto,
      paymentNumber,
      purchaseOrderId: new Types.ObjectId(createDto.purchaseOrderId),
      supplierId: new Types.ObjectId(createDto.supplierId),
      outletId: new Types.ObjectId(createDto.outletId),
      balanceAmount: createDto.totalAmount,
      paidAmount: 0,
      createdBy: new Types.ObjectId(userId),
    })

    return payment.save()
  }

  async recordPayment(id: string, recordDto: RecordPaymentDto, userId: string): Promise<SupplierPayment> {
    const payment = await this.paymentModel.findById(id)
    if (!payment) throw new NotFoundException("Payment not found")

    const newPaidAmount = payment.paidAmount + recordDto.amount
    if (newPaidAmount > payment.totalAmount) {
      throw new BadRequestException("Payment amount exceeds total amount")
    }

    const newBalance = payment.totalAmount - newPaidAmount
    let status = PaymentStatus.PARTIAL
    if (newBalance === 0) status = PaymentStatus.PAID
    else if (new Date(payment.dueDate) < new Date()) status = PaymentStatus.OVERDUE

    return this.paymentModel.findByIdAndUpdate(
      id,
      {
        paidAmount: newPaidAmount,
        balanceAmount: newBalance,
        status,
        paidDate: recordDto.paidDate,
        paymentMethod: recordDto.paymentMethod,
        referenceNumber: recordDto.referenceNumber,
        approvedBy: new Types.ObjectId(userId),
      },
      { new: true }
    ).populate("purchaseOrderId supplierId createdBy approvedBy")
  }

  async findAll(outletId?: string, status?: string): Promise<SupplierPayment[]> {
    const filter: any = {}
    if (outletId) filter.outletId = new Types.ObjectId(outletId)
    if (status) filter.status = status

    return this.paymentModel
      .find(filter)
      .populate("purchaseOrderId supplierId createdBy approvedBy")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<SupplierPayment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate("purchaseOrderId supplierId createdBy approvedBy")
      .exec()
    
    if (!payment) throw new NotFoundException("Payment not found")
    return payment
  }

  async getOverduePayments(outletId?: string): Promise<SupplierPayment[]> {
    const filter: any = {
      status: { $in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL] },
      dueDate: { $lt: new Date() }
    }
    if (outletId) filter.outletId = new Types.ObjectId(outletId)

    return this.paymentModel.find(filter).populate("supplierId purchaseOrderId").exec()
  }

  async getPaymentStats(outletId?: string) {
    const filter: any = {}
    if (outletId) filter.outletId = new Types.ObjectId(outletId)

    const stats = await this.paymentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$paidAmount" },
          totalBalance: { $sum: "$balanceAmount" },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          overdueCount: { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } },
        }
      }
    ])

    return stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalBalance: 0,
      pendingCount: 0,
      paidCount: 0,
      overdueCount: 0,
    }
  }

  private async generatePaymentNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.paymentModel.countDocuments({
      paymentNumber: { $regex: `^PAY-${year}-` }
    })
    return `PAY-${year}-${String(count + 1).padStart(4, '0')}`
  }
}
