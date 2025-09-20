import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReconciliationService } from './reconciliation.service'
import { ReconciliationController } from './reconciliation.controller'
import { Reconciliation, ReconciliationSchema } from '../../schemas/reconciliation.schema'
import { Sale, SaleSchema } from '../../schemas/sale.schema'
import { Product, ProductSchema } from '../../schemas/product.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reconciliation.name, schema: ReconciliationSchema },
      { name: Sale.name, schema: SaleSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [ReconciliationController],
  providers: [ReconciliationService],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}