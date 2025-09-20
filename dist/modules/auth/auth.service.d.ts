import { JwtService } from "@nestjs/jwt";
import type { Model } from "mongoose";
import { User, type UserDocument } from "../../schemas/user.schema";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            outletId: any;
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    revokeToken(token: string): Promise<{
        success: boolean;
    }>;
    revokeAllUserSessions(userId: string): Promise<{
        success: boolean;
    }>;
    getUserSessions(userId: string): Promise<{
        currentSession: {
            lastLogin: Date;
            lastLogout: Date;
        };
        activeSessions: any[];
    }>;
    revokeSession(userId: string, sessionId: string): Promise<{
        success: boolean;
    }>;
    register(registerDto: RegisterDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        role: import("../../schemas/user.schema").UserRole;
        status: import("../../schemas/user.schema").UserStatus;
        outletId: import("mongoose").Types.ObjectId;
        phone: string;
        avatar: string;
        lastLogin: Date;
        lastLogout: Date;
        isFirstLogin: boolean;
        _id: any;
        __v?: any;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }>;
    refreshToken(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            outletId: any;
        };
    }>;
    refreshTokenWithValidation(token: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../../schemas/user.schema").UserRole;
            outletId: import("mongoose").Types.ObjectId;
        };
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getProfile(userId: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        role: import("../../schemas/user.schema").UserRole;
        status: import("../../schemas/user.schema").UserStatus;
        outletId: import("mongoose").Types.ObjectId;
        phone: string;
        avatar: string;
        lastLogin: Date;
        lastLogout: Date;
        isFirstLogin: boolean;
        _id: any;
        __v?: any;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }>;
}
