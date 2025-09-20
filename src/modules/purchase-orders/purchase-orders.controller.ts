import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { PurchaseOrdersService } from "./purchase-orders.service"
import { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto"
import { UpdatePurchaseOrderDto } from "./dto/update-purchase-order.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("purchase-orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("purchase-orders")
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new purchase order" })
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto, req.user.userId)
  }

  @Get()
  @ApiOperation({ summary: "Get all purchase orders" })
  @ApiQuery({ name: "outletId", required: false })
  findAll(@Query("outletId") outletId?: string) {
    return this.purchaseOrdersService.findAll(outletId)
  }

  @Get("statistics")
  @ApiOperation({ summary: "Get purchase order statistics" })
  @ApiQuery({ name: "outletId", required: false })
  getStatistics(@Query("outletId") outletId?: string) {
    return this.purchaseOrdersService.getStatistics(outletId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a purchase order by ID" })
  findOne(@Param("id") id: string) {
    return this.purchaseOrdersService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a purchase order" })
  update(@Param("id") id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto)
  }

  @Patch(":id/approve")
  @ApiOperation({ summary: "Approve a purchase order" })
  approve(@Param("id") id: string, @Request() req: any) {
    return this.purchaseOrdersService.approve(id, req.user.userId)
  }

  @Patch(":id/cancel")
  @ApiOperation({ summary: "Cancel a purchase order" })
  cancel(@Param("id") id: string) {
    return this.purchaseOrdersService.cancel(id)
  }

  @Patch(":id/deliver")
  @ApiOperation({ summary: "Mark purchase order as delivered" })
  markAsDelivered(@Param("id") id: string, @Body() body: { actualDeliveryDate?: string }) {
    return this.purchaseOrdersService.markAsDelivered(id, body.actualDeliveryDate)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a purchase order" })
  remove(@Param("id") id: string) {
    return this.purchaseOrdersService.remove(id)
  }
}