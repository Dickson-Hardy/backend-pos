import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ReturnsService } from "./returns.service"
import { CreateReturnDto } from "./dto/create-return.dto"

@Controller("returns")
@UseGuards(JwtAuthGuard)
export class ReturnsController {
  constructor(private readonly service: ReturnsService) {}

  @Post()
  create(@Body() createDto: CreateReturnDto, @Request() req) {
    return this.service.create(createDto, req.user.userId)
  }

  @Post(":id/approve")
  approve(@Param("id") id: string, @Request() req) {
    return this.service.approve(id, req.user.userId)
  }

  @Post(":id/reject")
  reject(@Param("id") id: string, @Request() req) {
    return this.service.reject(id, req.user.userId)
  }

  @Post(":id/restock")
  restock(@Param("id") id: string) {
    return this.service.restockInventory(id)
  }

  @Get()
  findAll(@Query("outletId") outletId?: string, @Query("status") status?: string) {
    return this.service.findAll(outletId, status)
  }

  @Get("stats")
  getStats(@Query("outletId") outletId?: string) {
    return this.service.getReturnStats(outletId)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id)
  }
}
