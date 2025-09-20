import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReceiptTemplatesService } from './receipt-templates.service'
import { ReceiptTemplatesController } from './receipt-templates.controller'
import { ReceiptTemplate, ReceiptTemplateSchema } from '../../schemas/receipt-template.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReceiptTemplate.name, schema: ReceiptTemplateSchema }
    ])
  ],
  controllers: [ReceiptTemplatesController],
  providers: [ReceiptTemplatesService],
  exports: [ReceiptTemplatesService],
})
export class ReceiptTemplatesModule {}