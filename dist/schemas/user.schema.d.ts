import { type Document, Types } from "mongoose";
export type UserDocument = User & Document;
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    CASHIER = "cashier"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    outletId: Types.ObjectId;
    phone: string;
    avatar: string;
    lastLogin: Date;
    lastLogout: Date;
    isFirstLogin: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
