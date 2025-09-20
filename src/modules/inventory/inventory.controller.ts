import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { InventoryService } from "./inventory.service"
import { CreateInventoryAdjustmentDto } from "./dto/create-inventory-adjustment.dto"
import { ProductsService } from "../products/products.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

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
  getBatches(@Query("outletId") outletId?: string) {
    // This would need to be implemented based on batch schema
    // For now, return empty array
    return []
  }
}