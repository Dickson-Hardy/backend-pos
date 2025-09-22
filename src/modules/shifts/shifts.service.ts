import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Shift, ShiftDocument } from '../../schemas/shift.schema'
import { Expense, ExpenseDocument } from '../../schemas/expense.schema'
import { CreateShiftDto } from './dto/create-shift.dto'
import { EndShiftDto } from './dto/end-shift.dto'
import { CreateExpenseDto } from './dto/create-expense.dto'

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async createShift(createShiftDto: CreateShiftDto, cashierId: string, outletId: string) {
    // Check if cashier has an active shift
    const activeShift = await this.shiftModel.findOne({
      cashierId: new Types.ObjectId(cashierId),
      status: 'active'
    })

    if (activeShift) {
      throw new BadRequestException('Cashier already has an active shift')
    }

    const shift = new this.shiftModel({
      ...createShiftDto,
      cashierId: new Types.ObjectId(cashierId),
      outletId: new Types.ObjectId(outletId),
      startTime: new Date(),
      netAmount: createShiftDto.openingBalance,
    })

    return shift.save()
  }

  async endShift(shiftId: string, endShiftDto: EndShiftDto, cashierId: string) {
    const shift = await this.shiftModel.findOne({
      _id: new Types.ObjectId(shiftId),
      cashierId: new Types.ObjectId(cashierId),
      status: 'active'
    })

    if (!shift) {
      throw new NotFoundException('Active shift not found')
    }

    const closingBalance = endShiftDto.closingBalance
    const netAmount = closingBalance - shift.openingBalance

    shift.endTime = new Date()
    shift.closingBalance = closingBalance
    shift.netAmount = netAmount
    shift.status = 'closed'
    if (endShiftDto.notes) {
      shift.notes = endShiftDto.notes
    }

    return shift.save()
  }

  async getCurrentShift(cashierId: string) {
    return this.shiftModel.findOne({
      cashierId: new Types.ObjectId(cashierId),
      status: 'active'
    }).populate('cashierId', 'name email').populate('outletId', 'name address')
  }

  async getShiftById(shiftId: string, cashierId: string) {
    const shift = await this.shiftModel.findOne({
      _id: new Types.ObjectId(shiftId),
      cashierId: new Types.ObjectId(cashierId)
    }).populate('cashierId', 'name email').populate('outletId', 'name address')

    if (!shift) {
      throw new NotFoundException('Shift not found')
    }

    return shift
  }

  async getDailyShifts(outletId: string, date: string) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    return this.shiftModel.find({
      outletId: new Types.ObjectId(outletId),
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('cashierId', 'name email').sort({ startTime: -1 })
  }

  async getShiftReport(shiftId: string, cashierId: string) {
    const shift = await this.getShiftById(shiftId, cashierId)
    
    // Get all expenses for this shift
    const expenses = await this.expenseModel.find({
      shiftId: new Types.ObjectId(shiftId)
    }).sort({ createdAt: -1 })

    return {
      shift,
      expenses,
      summary: {
        totalSales: shift.totalSales,
        totalExpenses: shift.totalExpenses,
        netAmount: shift.netAmount,
        openingBalance: shift.openingBalance,
        closingBalance: shift.closingBalance,
        duration: shift.endTime 
          ? Math.floor((shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))
          : Math.floor((new Date().getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))
      }
    }
  }

  async addExpense(shiftId: string, createExpenseDto: CreateExpenseDto, cashierId: string) {
    // Verify shift exists and is active
    const shift = await this.shiftModel.findOne({
      _id: new Types.ObjectId(shiftId),
      cashierId: new Types.ObjectId(cashierId),
      status: 'active'
    })

    if (!shift) {
      throw new NotFoundException('Active shift not found')
    }

    // Create expense
    const expense = new this.expenseModel({
      ...createExpenseDto,
      shiftId: new Types.ObjectId(shiftId),
      addedBy: new Types.ObjectId(cashierId)
    })

    const savedExpense = await expense.save()

    // Update shift totals
    shift.totalExpenses += createExpenseDto.amount
    shift.netAmount = shift.openingBalance + shift.totalSales - shift.totalExpenses
    await shift.save()

    return savedExpense
  }

  async getShiftExpenses(shiftId: string, cashierId: string) {
    // Verify shift belongs to cashier
    const shift = await this.shiftModel.findOne({
      _id: new Types.ObjectId(shiftId),
      cashierId: new Types.ObjectId(cashierId)
    })

    if (!shift) {
      throw new NotFoundException('Shift not found')
    }

    return this.expenseModel.find({
      shiftId: new Types.ObjectId(shiftId)
    }).sort({ createdAt: -1 })
  }

  async updateShiftSales(shiftId: string, saleAmount: number) {
    const shift = await this.shiftModel.findById(shiftId)
    if (!shift) {
      throw new NotFoundException('Shift not found')
    }

    shift.totalSales += saleAmount
    shift.netAmount = shift.openingBalance + shift.totalSales - shift.totalExpenses
    return shift.save()
  }

  async getDailySummary(outletId: string, date: string) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const shifts = await this.shiftModel.find({
      outletId: new Types.ObjectId(outletId),
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    })

    const summary = shifts.reduce((acc, shift) => {
      acc.totalSales += shift.totalSales
      acc.totalExpenses += shift.totalExpenses
      acc.netAmount += shift.netAmount
      acc.shiftCount += 1
      return acc
    }, {
      totalSales: 0,
      totalExpenses: 0,
      netAmount: 0,
      shiftCount: 0
    })

    return {
      date,
      ...summary,
      shifts: shifts.map(shift => ({
        id: shift._id,
        cashierId: shift.cashierId,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
        totalSales: shift.totalSales,
        totalExpenses: shift.totalExpenses,
        netAmount: shift.netAmount
      }))
    }
  }
}
