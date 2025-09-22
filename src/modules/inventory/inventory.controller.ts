import { Controller, Get, Post, Body, Query, UseGuards, Param, Put, Patch, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from "@nestjs/swagger"
import { InventoryService } from "./inventory.service"
import { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto"
import { ProductsService } from "../products/products.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto"
import { CreateBatchDto } from "./dto/create-batch.dto"
import { UpdateBatchDto } from "./dto/update-batch.dto"

@ApiTags("inventory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("inventory")
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly productsService: ProductsService,
  ) {}

  @Get("items")
  @ApiOperation({ summary: "Get inventory items" })
  @ApiQuery({ name: "outletId", required: false })
  getItems(@Query("outletId") outletId?: string) {
    return this.productsService.findAll(outletId)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get inventory statistics" })
  @ApiQuery({ name: "outletId", required: false })
  async getStats(@Query("outletId") outletId?: string) {
    const products = await this.productsService.findAll(outletId)
    const lowStockProducts = await this.productsService.findLowStock(outletId)
    
    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => sum + (product.stockQuantity * product.costPrice), 0)
    const lowStockCount = lowStockProducts.length
    
    return {
      totalProducts,
      totalValue,
      lowStockCount,
      lowStockProducts,
    }
  }

  @Post("adjust")
  @ApiOperation({ summary: "Adjust inventory" })
  adjust(@Body() createAdjustmentDto: CreateInventoryAdjustmentDto) {
    console.log('=== CONTROLLER: Inventory adjustment request ===')
    console.log('DTO received:', createAdjustmentDto)
    return this.inventoryService.adjustInventory(createAdjustmentDto)
  }

  @Get("adjustments")
  @ApiOperation({ summary: "Get inventory adjustment history" })
  @ApiQuery({ name: "outletId", required: false })
  @ApiQuery({ name: "productId", required: false })
  getAdjustments(
    @Query("outletId") outletId?: string,
    @Query("productId") productId?: string,
  ) {
    return this.inventoryService.getAdjustmentHistory(outletId, productId)
  }

  @Get("batches")
  @ApiOperation({ summary: "Get inventory batches" })
  @ApiQuery({ name: "outletId", required: false })
  @ApiQuery({ name: "productId", required: false })
  getBatches(@Query("outletId") outletId?: string, @Query("productId") productId?: string) {
    return this.inventoryService.listBatches(outletId, productId)
  }

  // Inventory item update (reorder/max levels)
  @Patch("items/:productId")
  @ApiOperation({ summary: "Update inventory item thresholds" })
  @ApiParam({ name: "productId" })
  updateInventoryItem(@Param("productId") productId: string, @Body() dto: UpdateInventoryItemDto) {
    return this.inventoryService.updateInventoryItem(productId, dto)
  }

  // Batch CRUD
  @Get("batches/:id")
  @ApiOperation({ summary: "Get a batch by id" })
  getBatch(@Param("id") id: string) {
    return this.inventoryService.getBatch(id)
  }

  @Post("batches")
  @ApiOperation({ summary: "Create a batch" })
  createBatch(@Body() dto: CreateBatchDto) {
    return this.inventoryService.createBatch(dto)
  }

  @Patch("batches/:id")
  @ApiOperation({ summary: "Update a batch" })
  updateBatch(@Param("id") id: string, @Body() dto: UpdateBatchDto) {
    return this.inventoryService.updateBatch(id, dto)
  }

  @Delete("batches/:id")
  @ApiOperation({ summary: "Delete a batch" })
  deleteBatch(@Param("id") id: string) {
    return this.inventoryService.deleteBatch(id)
  }
}