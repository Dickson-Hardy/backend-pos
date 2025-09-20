import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { OutletsService } from "./outlets.service"
import { CreateOutletDto } from "./dto/create-outlet.dto"
import { UpdateOutletDto } from "./dto/update-outlet.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("outlets")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("outlets")
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new outlet" })
  create(@Body() createOutletDto: CreateOutletDto) {
    return this.outletsService.create(createOutletDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all outlets" })
  findAll() {
    return this.outletsService.findAll()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get outlet by ID" })
  findOne(@Param("id") id: string) {
    return this.outletsService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update outlet" })
  update(@Param("id") id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletsService.update(id, updateOutletDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update outlet (PUT method)" })
  updatePut(@Param("id") id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletsService.update(id, updateOutletDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete outlet" })
  remove(@Param("id") id: string) {
    return this.outletsService.remove(id)
  }
}