import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Sale, type SaleDocument } from "../../schemas/sale.schema"
import { Product, type ProductDocument } from "../../schemas/product.schema"
import { Batch, type BatchDocument } from "../../schemas/batch.schema"
import { User, type UserDocument } from "../../schemas/user.schema"

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getSalesReport(outletId: string, startDate: Date, endDate: Date) {
    const sales = await this.saleModel
      .find({
        outletId,
        saleDate: { $gte: startDate, $lte: endDate },
      })
      .populate("items.productId")
      .populate("cashierId", "firstName lastName email")

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTransactions = sales.length
    const avgTransactionValue = totalRevenue / totalTransactions || 0

    // Group sales by period (daily, weekly, monthly)
    const salesByPeriod = this.groupSalesByPeriod(sales, "daily")

    // Top selling products
    const productSales = new Map()
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const productId = item.productId.toString()
        if (productSales.has(productId)) {
          const existing = productSales.get(productId)
          existing.quantity += item.quantity
          existing.revenue += item.totalPrice
        } else {
          productSales.set(productId, {
            productId: item.productId,
            quantity: item.quantity,
            revenue: item.totalPrice,
          })
        }
      })
    })

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    return {
      totalRevenue,
      totalTransactions,
      avgTransactionValue,
      salesByPeriod,
      topProducts,
    }
  }

  async getInventoryReport(outletId: string) {
    const products = await this.productModel.find({ outletId })
    const batches = await this.batchModel.find({ outletId })

    const totalInventoryValue = products.reduce((sum, product) => sum + product.sellingPrice * product.stockQuantity, 0)

    const totalInventoryCost = products.reduce((sum, product) => sum + product.costPrice * product.stockQuantity, 0)

    // Low stock items
    const lowStockItems = products.filter((product) => product.stockQuantity < product.reorderLevel)

    // Expiring batches (within 6 months)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

    const expiringBatches = batches.filter(
      (batch) => new Date(batch.expiryDate) < sixMonthsFromNow && new Date(batch.expiryDate) > new Date(),
    )

    // Expired batches
    const expiredBatches = batches.filter((batch) => new Date(batch.expiryDate) < new Date())

    // Category breakdown
    const categoryBreakdown = new Map()
    products.forEach((product) => {
      const category = product.category
      if (categoryBreakdown.has(category)) {
        const existing = categoryBreakdown.get(category)
        existing.value += product.sellingPrice * product.stockQuantity
        existing.cost += product.costPrice * product.stockQuantity
        existing.count += 1
      } else {
        categoryBreakdown.set(category, {
          category,
          value: product.sellingPrice * product.stockQuantity,
          cost: product.costPrice * product.stockQuantity,
          count: 1,
        })
      }
    })

    return {
      totalInventoryValue,
      totalInventoryCost,
      lowStockItems,
      expiringBatches,
      expiredBatches,
      categoryBreakdown: Array.from(categoryBreakdown.values()),
    }
  }

  async getStaffPerformance(outletId: string, startDate: Date, endDate: Date) {
    const sales = await this.saleModel
      .find({
        outletId,
        saleDate: { $gte: startDate, $lte: endDate },
      })
      .populate("cashierId", "firstName lastName email role")

    const staffPerformance = new Map()

    sales.forEach((sale) => {
      const cashierId = sale.cashierId._id.toString()
      if (staffPerformance.has(cashierId)) {
        const existing = staffPerformance.get(cashierId)
        existing.sales += sale.total
        existing.transactions += 1
      } else {
        staffPerformance.set(cashierId, {
          cashier: sale.cashierId,
          sales: sale.total,
          transactions: 1,
        })
      }
    })

    return Array.from(staffPerformance.values())
      .map((staff) => ({
        ...staff,
        avgTransactionValue: staff.sales / staff.transactions,
      }))
      .sort((a, b) => b.sales - a.sales)
  }

  private groupSalesByPeriod(sales: any[], period: "daily" | "weekly" | "monthly") {
    const grouped = new Map()

    sales.forEach((sale) => {
      let key: string
      const date = new Date(sale.saleDate)

      switch (period) {
        case "daily":
          key = date.toISOString().split("T")[0]
          break
        case "weekly":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split("T")[0]
          break
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
      }

      if (grouped.has(key)) {
        const existing = grouped.get(key)
        existing.revenue += sale.total
        existing.transactions += 1
      } else {
        grouped.set(key, {
          period: key,
          revenue: sale.total,
          transactions: 1,
        })
      }
    })

    return Array.from(grouped.values()).sort((a, b) => a.period.localeCompare(b.period))
  }
}
