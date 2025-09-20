import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ReportsService } from "./reports.service"

@ApiTags("reports")
@ApiBearerAuth()
@Controller("reports")
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("sales")
  @ApiOperation({ summary: "Get sales report" })
  @ApiQuery({ name: "outletId", required: false })
  @ApiQuery({ name: "startDate", required: true })
  @ApiQuery({ name: "endDate", required: true })
  async getSalesReport(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.reportsService.getSalesReport(outletId, new Date(startDate), new Date(endDate))
  }

  @Get("sales/weekly")
  @ApiOperation({ summary: "Get weekly sales report" })
  @ApiQuery({ name: "outletId", required: false })
  async getWeeklySales(@Query("outletId") outletId?: string) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    return this.reportsService.getSalesReport(outletId, startDate, endDate)
  }

  @Get("inventory")
  @ApiOperation({ summary: "Get inventory report" })
  @ApiQuery({ name: "outletId", required: false })
  async getInventoryReport(@Query("outletId") outletId?: string) {
    return this.reportsService.getInventoryReport(outletId)
  }

  @Get("staff-performance")
  @ApiOperation({ summary: "Get staff performance report" })
  @ApiQuery({ name: "outletId", required: false })
  @ApiQuery({ name: "startDate", required: true })
  @ApiQuery({ name: "endDate", required: true })
  async getStaffPerformance(
    @Query("outletId") outletId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.reportsService.getStaffPerformance(outletId, new Date(startDate), new Date(endDate))
  }
}
