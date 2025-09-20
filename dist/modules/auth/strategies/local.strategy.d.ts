import { Strategy } from "passport-local";
import { Model } from "mongoose";
import { UserDocument } from "../../../schemas/user.schema";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(email: string, password: string): Promise<any>;
}
export {};
