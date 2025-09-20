import { Strategy } from "passport-jwt";
import { Model } from "mongoose";
import { User, UserDocument } from "../../../schemas/user.schema";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(payload: any): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export {};
