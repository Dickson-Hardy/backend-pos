import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    refresh(req: any): Promise<{
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
    logout(req: any): Promise<{
        message: string;
    }>;
    revokeToken(req: any): Promise<{
        message: string;
    }>;
    revokeAllSessions(req: any): Promise<{
        message: string;
    }>;
    getUserSessions(req: any): Promise<{
        currentSession: {
            lastLogin: Date;
            lastLogout: Date;
        };
        activeSessions: any[];
    }>;
    revokeSession(req: any, sessionId: string): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
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
    testNoAuth(): Promise<{
        message: string;
        timestamp: Date;
    }>;
}
