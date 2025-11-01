import { Controller, Get, Post, Body, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { SalesService } from "./sales.service"
import { CreateSaleDto } from "./dto/create-sale.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("sales")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new sale" })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all sales" })
  @ApiQuery({ name: "outletId", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  @ApiQuery({ name: "cashierId", required: false })
  @ApiQuery({ name: "status", required: false })
  findAll(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("cashierId") cashierId?: string,
    @Query("status") status?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.salesService.findAll(outletId, start, end, cashierId, status)
  }

  @Get("daily")
  @ApiOperation({ summary: "Get daily sales summary" })
  @ApiQuery({ name: "outletId", required: false })
  getDailySales(@Query("outletId") outletId?: string) {
    return this.salesService.getDailySales(outletId)
  }

  @Get("search/:query")
  @ApiOperation({ summary: "Search sales" })
  search(@Param("query") query: string, @Query("outletId") outletId?: string) {
    return this.salesService.searchSales(query, outletId)
  }

  @Get("analytics/hourly")
  @ApiOperation({ summary: "Get hourly sales breakdown" })
  getHourlySales(@Query("outletId") outletId?: string, @Query("date") date?: string) {
    const targetDate = date ? new Date(date) : undefined
    return this.salesService.getSalesByHour(outletId, targetDate)
  }

  @Get("analytics/by-category")
  @ApiOperation({ summary: "Get sales by category" })
  getSalesByCategory(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.salesService.getSalesByCategory(outletId, start, end)
  }

  @Get("analytics/cashier-performance")
  @ApiOperation({ summary: "Get cashier performance metrics" })
  getCashierPerformance(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.salesService.getCashierPerformance(outletId, start, end)
  }

  @Get("analytics/payment-methods")
  @ApiOperation({ summary: "Get payment method breakdown" })
  getPaymentMethods(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.salesService.getPaymentMethodBreakdown(outletId, start, end)
  }

  @Get("analytics/comparison")
  @ApiOperation({ summary: "Get sales comparison (today vs yesterday, this week vs last week)" })
  getSalesComparison(@Query("outletId") outletId?: string) {
    return this.salesService.getSalesComparison(outletId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get sale by ID" })
  findOne(@Param("id") id: string) {
    return this.salesService.findOne(id)
  }
}