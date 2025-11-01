import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SupplierPaymentsController } from "./supplier-payments.controller"
import { SupplierPaymentsService } from "./supplier-payments.service"
import { SupplierPayment, SupplierPaymentSchema } from "../../schemas/supplier-payment.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupplierPayment.name, schema: SupplierPaymentSchema }
    ])
  ],
  controllers: [SupplierPaymentsController],
  providers: [SupplierPaymentsService],
  exports: [SupplierPaymentsService]
})
export class SupplierPaymentsModule {}
