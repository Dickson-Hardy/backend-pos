import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type SessionDocument = Session & Document

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId

  @Prop({ required: true })
  tokenHash: string

  @Prop({ required: true })
  ipAddress: string

  @Prop({ required: true })
  userAgent: string

  @Prop()
  deviceInfo?: string

  @Prop()
  location?: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  lastActivity: Date

  @Prop()
  expiresAt: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)