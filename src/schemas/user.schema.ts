import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type UserDocument = User & Document

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  CASHIER = "cashier",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true, enum: UserRole })
  role: UserRole

  @Prop({ default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus

  @Prop({ type: Types.ObjectId, ref: "Outlet" })
  outletId: Types.ObjectId

  @Prop()
  phone: string

  @Prop()
  avatar: string

  @Prop({ default: Date.now })
  lastLogin: Date

  @Prop()
  lastLogout: Date

  @Prop({ default: true })
  isFirstLogin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
