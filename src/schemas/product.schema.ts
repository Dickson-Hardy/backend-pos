import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ProductDocument = Product & Document

export enum ProductCategory {
  PRESCRIPTION = "prescription",
  OTC = "otc",
  PAIN_RELIEF = "pain_relief",
  ANTIBIOTICS = "antibiotics",
  CARDIOVASCULAR = "cardiovascular",
  DIABETES = "diabetes",
  GASTROINTESTINAL = "gastrointestinal",
  RESPIRATORY = "respiratory",
  MENTAL_HEALTH = "mental_health",
  VITAMINS = "vitamins",
  DERMATOLOGY = "dermatology",
  MEDICAL_EQUIPMENT = "medical_equipment",
  SUPPLEMENTS = "supplements",
  PERSONAL_CARE = "personal_care",
  FIRST_AID = "first_aid",
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

export enum UnitOfMeasure {
  TABLETS = "tablets",
  CAPSULES = "capsules",
  SOFTGELS = "softgels",
  INHALERS = "inhalers",
  TUBES = "tubes",
  ML = "ml",
  MG = "mg",
  GRAMS = "grams",
  PIECES = "pieces",
  BOTTLES = "bottles",
  BOXES = "boxes",
  STRIPS = "strips",
  VIALS = "vials",
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  sku: string

  @Prop()
  barcode: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory

  @Prop({ required: true })
  manufacturer: string

  @Prop({ required: true })
  genericName: string

  @Prop({ required: true })
  strength: string

  @Prop({ required: true, enum: UnitOfMeasure })
  unitOfMeasure: UnitOfMeasure

  @Prop({ required: true })
  costPrice: number

  @Prop({ required: true })
  sellingPrice: number

  @Prop({ default: 0 })
  stockQuantity: number

  @Prop({ default: 10 })
  reorderLevel: number

  @Prop({ default: 100 })
  maxStockLevel: number

  @Prop({ default: ProductStatus.ACTIVE, enum: ProductStatus })
  status: ProductStatus

  @Prop()
  image: string

  @Prop({ default: false })
  requiresPrescription: boolean

  @Prop()
  activeIngredients: string[]

  @Prop()
  sideEffects: string[]

  @Prop()
  dosageInstructions: string

  @Prop()
  storageInstructions: string

  @Prop({ type: Types.ObjectId, ref: "Outlet" })
  outletId: Types.ObjectId

  @Prop({ default: true })
  allowUnitSale: boolean // whether individual units can be sold

  // Pack variants will be populated via virtual populate
}

export const ProductSchema = SchemaFactory.createForClass(Product)

// Virtual populate for pack variants
ProductSchema.virtual('packVariants', {
  ref: 'PackVariant',
  localField: '_id',
  foreignField: 'productId',
})

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true })
ProductSchema.set('toObject', { virtuals: true })
