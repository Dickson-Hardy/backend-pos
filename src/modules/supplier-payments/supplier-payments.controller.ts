import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { SupplierPaymentsService } from "./supplier-payments.service"
import { CreateSupplierPaymentDto } from "./dto/create-supplier-payment.dto"
import { RecordPaymentDto } from "./dto/record-payment.dto"

@Controller("supplier-payments")
@UseGuards(JwtAuthGuard)
export class SupplierPaymentsController {
  constructor(private readonly service: SupplierPaymentsService) {}

  @Post()
  create(@Body() createDto: CreateSupplierPaymentDto, @Request() req) {
    return this.service.create(createDto, req.user.userId)
  }

  @Post(":id/record-payment")
  recordPayment(@Param("id") id: string, @Body() recordDto: RecordPaymentDto, @Request() req) {
    return this.service.recordPayment(id, recordDto, req.user.userId)
  }

  @Get()
  findAll(@Query("outletId") outletId?: string, @Query("status") status?: string) {
    return this.service.findAll(outletId, status)
  }

  @Get("overdue")
  getOverdue(@Query("outletId") outletId?: string) {
    return this.service.getOverduePayments(outletId)
  }

  @Get("stats")
  getStats(@Query("outletId") outletId?: string) {
    return this.service.getPaymentStats(outletId)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id)
  }
}
