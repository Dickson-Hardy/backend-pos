import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ProductTransfersService } from "./product-transfers.service"
import { CreateTransferDto } from "./dto/create-transfer.dto"

@Controller("product-transfers")
@UseGuards(JwtAuthGuard)
export class ProductTransfersController {
  constructor(private readonly service: ProductTransfersService) {}

  @Post()
  create(@Body() createDto: CreateTransferDto, @Request() req) {
    return this.service.create(createDto, req.user.userId)
  }

  @Post(":id/approve")
  approve(@Param("id") id: string, @Request() req) {
    return this.service.approve(id, req.user.userId)
  }

  @Post(":id/complete")
  complete(@Param("id") id: string, @Request() req) {
    return this.service.complete(id, req.user.userId)
  }

  @Post(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.service.cancel(id)
  }

  @Get()
  findAll(@Query("outletId") outletId?: string, @Query("status") status?: string) {
    return this.service.findAll(outletId, status)
  }

  @Get("stats")
  getStats(@Query("outletId") outletId?: string) {
    return this.service.getStats(outletId)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id)
  }
}
