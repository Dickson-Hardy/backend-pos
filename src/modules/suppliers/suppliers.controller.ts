import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common"
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger"
import { SuppliersService } from "./suppliers.service"
import { CreateSupplierDto } from "./dto/create-supplier.dto"
import { UpdateSupplierDto } from "./dto/update-supplier.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("suppliers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("suppliers")
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new supplier" })
  @ApiResponse({ status: 201, description: "Supplier created successfully" })
  @ApiResponse({ status: 409, description: "Supplier with this name already exists" })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all suppliers" })
  @ApiQuery({ name: "outletId", required: false, description: "Filter by outlet ID" })
  @ApiQuery({ name: "status", required: false, description: "Filter by status" })
  @ApiResponse({ status: 200, description: "List of suppliers" })
  findAll(
    @Query("outletId") outletId?: string,
    @Query("status") status?: string
  ) {
    return this.suppliersService.findAll(outletId, status)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get supplier statistics" })
  @ApiQuery({ name: "outletId", required: false, description: "Filter by outlet ID" })
  @ApiResponse({ status: 200, description: "Supplier statistics" })
  getStats(@Query("outletId") outletId?: string) {
    return this.suppliersService.getSupplierStats(outletId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a supplier by ID" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Supplier details" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  findOne(@Param("id") id: string) {
    return this.suppliersService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a supplier (partial)" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Supplier updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  @ApiResponse({ status: 409, description: "Supplier with this name already exists" })
  update(@Param("id") id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a supplier (full)" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Supplier updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  @ApiResponse({ status: 409, description: "Supplier with this name already exists" })
  updateFull(@Param("id") id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a supplier" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Supplier deleted successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  remove(@Param("id") id: string) {
    return this.suppliersService.remove(id)
  }

  @Patch(":id/rating")
  @ApiOperation({ summary: "Update supplier rating" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Rating updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  updateRating(
    @Param("id") id: string,
    @Body() body: { rating: number }
  ) {
    return this.suppliersService.updateRating(id, body.rating)
  }

  @Patch(":id/last-order")
  @ApiOperation({ summary: "Update supplier last order date" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Last order date updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  updateLastOrder(
    @Param("id") id: string,
    @Body() body: { orderDate: string }
  ) {
    return this.suppliersService.updateLastOrder(id, new Date(body.orderDate))
  }

  @Patch(":id/products-supplied")
  @ApiOperation({ summary: "Increment products supplied count" })
  @ApiParam({ name: "id", description: "Supplier ID" })
  @ApiResponse({ status: 200, description: "Products supplied count updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  incrementProductsSupplied(
    @Param("id") id: string,
    @Body() body: { count?: number }
  ) {
    return this.suppliersService.incrementProductsSupplied(id, body.count || 1)
  }
}