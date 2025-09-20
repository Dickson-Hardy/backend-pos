import { Controller, Get, Post, Patch, Put, Delete, UseGuards, Query, Param, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { ProductsService } from "./products.service"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiQuery({ name: "outletId", required: false })
  findAll(@Query("outletId") outletId?: string) {
    return this.productsService.findAll(outletId)
  }

  @Get("low-stock")
  @ApiOperation({ summary: "Get products with low stock" })
  @ApiQuery({ name: "outletId", required: false })
  findLowStock(@Query("outletId") outletId?: string) {
    return this.productsService.findLowStock(outletId)
  }

  @Get("search")
  @ApiOperation({ summary: "Search products" })
  @ApiQuery({ name: "q", required: true })
  search(@Query("q") query: string) {
    return this.productsService.search(query)
  }

  @Get("barcode/:barcode")
  @ApiOperation({ summary: "Find product by barcode" })
  findByBarcode(@Param("barcode") barcode: string) {
    return this.productsService.findByBarcode(barcode)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product" })
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update product (PUT method)" })
  updatePut(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id)
  }

  @Patch(":id/stock")
  @ApiOperation({ summary: "Update product stock" })
  updateStock(@Param("id") id: string, @Body() body: { quantity: number }) {
    return this.productsService.updateStock(id, body.quantity)
  }
}
