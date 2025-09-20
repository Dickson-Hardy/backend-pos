import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ReconciliationService } from './reconciliation.service'
import { ReconciliationType, ReconciliationStatus } from '../../schemas/reconciliation.schema'

@Controller('reconciliation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  // DAILY CASH RECONCILIATION ENDPOINTS
  @Post('daily-cash/start')
  @Roles('admin', 'manager', 'cashier')
  startDailyCashReconciliation(
    @Body() body: {
      outletId: string
      reconciliationDate: string
      startingCash: number
    },
    @Request() req
  ) {
    return this.reconciliationService.startDailyCashReconciliation({
      outletId: body.outletId,
      performedBy: req.user.userId,
      reconciliationDate: new Date(body.reconciliationDate),
      startingCash: body.startingCash
    })
  }

  @Patch(':id/cash-count')
  @Roles('admin', 'manager', 'cashier')
  submitCashCount(
    @Param('id') id: string,
    @Body() body: {
      hundreds: number
      fifties: number
      twenties: number
      tens: number
      fives: number
      ones: number
      quarters: number
      dimes: number
      nickels: number
      pennies: number
      notes?: string
    },
    @Request() req
  ) {
    return this.reconciliationService.submitCashCount(id, body, req.user.userId)
  }

  // SHIFT RECONCILIATION ENDPOINTS
  @Post('shift/start')
  @Roles('admin', 'manager', 'cashier')
  createShiftReconciliation(
    @Body() body: {
      outletId: string
      shiftStart: string
      shiftEnd: string
      startingCash: number
    },
    @Request() req
  ) {
    return this.reconciliationService.createShiftReconciliation({
      outletId: body.outletId,
      performedBy: req.user.userId,
      shiftStart: new Date(body.shiftStart),
      shiftEnd: new Date(body.shiftEnd),
      startingCash: body.startingCash
    })
  }

  // BANK RECONCILIATION ENDPOINTS
  @Post('bank/start')
  @Roles('admin', 'manager')
  createBankReconciliation(
    @Body() body: {
      outletId: string
      statementDate: string
      statementBalance: number
      bookBalance: number
    },
    @Request() req
  ) {
    return this.reconciliationService.createBankReconciliation({
      outletId: body.outletId,
      performedBy: req.user.userId,
      statementDate: new Date(body.statementDate),
      statementBalance: body.statementBalance,
      bookBalance: body.bookBalance
    })
  }

  @Patch(':id/bank-item')
  @Roles('admin', 'manager')
  addBankReconciliationItem(
    @Param('id') id: string,
    @Body() body: {
      type: 'deposit' | 'withdrawal' | 'adjustment'
      date: string
      amount: number
      reference: string
      description: string
      adjustmentType?: 'fee' | 'interest' | 'charge' | 'credit'
    }
  ) {
    return this.reconciliationService.addBankReconciliationItem(id, {
      ...body,
      date: new Date(body.date)
    })
  }

  // INVENTORY RECONCILIATION ENDPOINTS
  @Post('inventory/start')
  @Roles('admin', 'manager')
  createInventoryReconciliation(
    @Body() body: {
      outletId: string
      productIds: string[]
    },
    @Request() req
  ) {
    return this.reconciliationService.createInventoryReconciliation({
      outletId: body.outletId,
      performedBy: req.user.userId,
      productIds: body.productIds
    })
  }

  @Patch(':id/inventory-count')
  @Roles('admin', 'manager')
  updateInventoryCount(
    @Param('id') id: string,
    @Body() body: {
      updates: Array<{
        productId: string
        countedQuantity: number
        batchNumber?: string
        location?: string
        reason?: string
      }>
    }
  ) {
    return this.reconciliationService.updateInventoryCount(id, body.updates)
  }

  // GENERAL ENDPOINTS
  @Get()
  @Roles('admin', 'manager')
  findAll(
    @Query('outletId') outletId?: string,
    @Query('type') type?: ReconciliationType,
    @Query('status') status?: ReconciliationStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters: any = {}
    
    if (outletId) filters.outletId = outletId
    if (type) filters.type = type
    if (status) filters.status = status
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)

    return this.reconciliationService.findAll(filters)
  }

  @Get('summary')
  @Roles('admin', 'manager')
  getReconciliationSummary(
    @Query('outletId') outletId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    if (!outletId || !startDate || !endDate) {
      throw new BadRequestException('outletId, startDate, and endDate are required')
    }

    return this.reconciliationService.getReconciliationSummary(
      outletId,
      new Date(startDate),
      new Date(endDate)
    )
  }

  @Get(':id')
  @Roles('admin', 'manager', 'cashier')
  findOne(@Param('id') id: string) {
    return this.reconciliationService.findOne(id)
  }

  @Patch(':id/approve')
  @Roles('admin', 'manager')
  approveReconciliation(
    @Param('id') id: string,
    @Body() body: { notes?: string },
    @Request() req
  ) {
    return this.reconciliationService.approveReconciliation(
      id,
      req.user.userId,
      body.notes
    )
  }

  // VARIANCE REPORTING
  @Get('variances/significant')
  @Roles('admin', 'manager')
  async getSignificantVariances(
    @Query('outletId') outletId?: string,
    @Query('days') days: string = '30'
  ) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))
    
    const filters: any = {
      startDate,
      endDate: new Date()
    }
    
    if (outletId) filters.outletId = outletId

    const reconciliations = await this.reconciliationService.findAll(filters)
    
    return reconciliations.filter(recon => recon.hasSignificantVariance)
  }

  // PENDING RECONCILIATIONS
  @Get('pending/all')
  @Roles('admin', 'manager')
  getPendingReconciliations(@Query('outletId') outletId?: string) {
    const filters: any = {
      status: ReconciliationStatus.COMPLETED // Awaiting approval
    }
    
    if (outletId) filters.outletId = outletId

    return this.reconciliationService.findAll(filters)
  }
}