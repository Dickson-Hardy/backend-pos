import { Document, Types } from "mongoose";
export type SessionDocument = Session & Document;
export declare class Session {
    userId: Types.ObjectId;
    tokenHash: string;
    ipAddress: string;
    userAgent: string;
    deviceInfo?: string;
    location?: string;
    isActive: boolean;
    lastActivity: Date;
    expiresAt: Date;
}
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any, Document<unknown, any, Session> & Session & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Session, Document<unknown, {}, import("mongoose").FlatRecord<Session>> & import("mongoose").FlatRecord<Session> & {
    _id: Types.ObjectId;
}>;
