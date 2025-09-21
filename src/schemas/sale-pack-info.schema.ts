import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type SalePackInfoDocument = SalePackInfo & Document

export enum SaleType {
  UNIT = "unit",
  PACK = "pack",
}

@Schema({ _id: false }) // Embedded schema, no separate _id
export class SalePackInfo {
  @Prop({ required: true, enum: SaleType })
  saleType: SaleType

  @Prop({ type: Types.ObjectId, ref: "PackVariant" })
  packVariantId?: Types.ObjectId // which pack variant was used (if pack sale)

  @Prop({ default: 0 })
  packQuantity?: number // number of packs sold

  @Prop({ default: 0 })
  unitQuantity?: number // number of individual units sold

  @Prop({ required: true })
  effectiveUnitCount: number // total units (for inventory deduction)
}

export const SalePackInfoSchema = SchemaFactory.createForClass(SalePackInfo)