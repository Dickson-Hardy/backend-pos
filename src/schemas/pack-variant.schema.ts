import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type PackVariantDocument = PackVariant & Document

@Schema({ timestamps: true })
export class PackVariant {
  @Prop({ required: true })
  packSize: number // number of units in this pack

  @Prop({ required: true })
  packPrice: number // price for the entire pack

  @Prop({ required: true })
  unitPrice: number // price per individual unit in this pack

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  name?: string // optional name like "3-pack", "dozen", etc.

  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId
}

export const PackVariantSchema = SchemaFactory.createForClass(PackVariant)