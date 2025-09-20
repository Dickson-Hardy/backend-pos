import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ReceiptTemplateDocument = ReceiptTemplate & Document

export enum TemplateStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

export enum TextAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum FontSize {
  SMALL = "small",     // ESC/POS: 0x00
  MEDIUM = "medium",   // ESC/POS: 0x11
  LARGE = "large",     // ESC/POS: 0x22
}

export enum FontStyle {
  NORMAL = "normal",
  BOLD = "bold",
  UNDERLINE = "underline",
  ITALIC = "italic",
}

// Receipt template element types
@Schema({ _id: false })
export class ReceiptElement {
  @Prop({ required: true })
  type: string // 'text', 'logo', 'line', 'qr', 'barcode', 'items_table', 'totals', 'spacer'

  @Prop({ required: true })
  content: string

  @Prop({ enum: TextAlignment, default: TextAlignment.LEFT })
  alignment: TextAlignment

  @Prop({ enum: FontSize, default: FontSize.MEDIUM })
  fontSize: FontSize

  @Prop({ enum: FontStyle, default: FontStyle.NORMAL })
  fontStyle: FontStyle

  @Prop({ default: false })
  bold: boolean

  @Prop({ default: false })
  underline: boolean

  @Prop({ default: 1 })
  height: number // Line height multiplier

  @Prop({ default: 0 })
  marginTop: number

  @Prop({ default: 0 })
  marginBottom: number

  @Prop({ type: Object, default: {} })
  properties: Record<string, any> // Additional properties for specific element types
}

// Paper size configuration
@Schema({ _id: false })
export class PaperConfiguration {
  @Prop({ required: true })
  width: number // Characters per line (typically 32, 42, 48, or 58 for thermal printers)

  @Prop({ default: 'mm' })
  unit: string

  @Prop({ default: 210 })
  physicalWidth: number // Physical width in mm

  @Prop({ default: 297 })
  physicalHeight: number // Physical height in mm (continuous for thermal)
}

// Printer configuration
@Schema({ _id: false })
export class PrinterConfiguration {
  @Prop({ required: true })
  type: string // 'thermal', 'impact', 'inkjet'

  @Prop({ required: true })
  model: string // 'xprinter-58mm', 'xprinter-80mm', etc.

  @Prop({ required: true })
  connectionType: string // 'bluetooth', 'usb', 'ethernet', 'wifi'

  @Prop({ default: 'ESC/POS' })
  commandSet: string

  @Prop({ type: Object, default: {} })
  settings: Record<string, any> // Printer-specific settings
}

@Schema({ timestamps: true })
export class ReceiptTemplate {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop({ enum: TemplateStatus, default: TemplateStatus.DRAFT })
  status: TemplateStatus

  @Prop({ type: Types.ObjectId, ref: 'Outlet', required: true })
  outletId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedBy: Types.ObjectId

  @Prop({ default: 1 })
  version: number

  @Prop({ type: [ReceiptElement], default: [] })
  elements: ReceiptElement[]

  @Prop({ type: PaperConfiguration, required: true })
  paperConfig: PaperConfiguration

  @Prop({ type: PrinterConfiguration, required: true })
  printerConfig: PrinterConfiguration

  @Prop({ default: false })
  isDefault: boolean

  @Prop({ default: false })
  isSystem: boolean // System templates cannot be deleted

  // Template variables that can be used in content
  @Prop({ type: [String], default: [] })
  availableVariables: string[]

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>
}

export const ReceiptTemplateSchema = SchemaFactory.createForClass(ReceiptTemplate)

// Create compound index for efficient queries
ReceiptTemplateSchema.index({ outletId: 1, status: 1 })
ReceiptTemplateSchema.index({ outletId: 1, isDefault: 1 })
ReceiptTemplateSchema.index({ isSystem: 1 })