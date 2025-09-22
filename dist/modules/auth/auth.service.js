"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../../schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).select("+password");
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            lastLogout: null
        });
        const payload = { email: user.email, sub: user._id, role: user.role };
        console.log('[Auth Service] Creating JWT with payload:', payload);
        console.log('[Auth Service] JWT Secret used:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
        console.log('[Auth Service] JWT Secret value:', (process.env.JWT_SECRET || "pharmacy-pos-secret").substring(0, 20) + '...');
        const token = this.jwtService.sign(payload);
        console.log('[Auth Service] Generated token length:', token.length);
        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                outletId: user.outletId,
            },
        };
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            lastLogout: new Date()
        });
        return { success: true };
    }
    async revokeToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded?.sub) {
                await this.userModel.findByIdAndUpdate(decoded.sub, {
                    lastLogout: new Date()
                });
            }
        }
        catch (error) {
        }
        return { success: true };
    }
    async revokeAllUserSessions(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            lastLogout: new Date()
        });
        return { success: true };
    }
    async getUserSessions(userId) {
        const user = await this.userModel.findById(userId).select('lastLogin lastLogout');
        return {
            currentSession: {
                lastLogin: user?.lastLogin,
                lastLogout: user?.lastLogout
            },
            activeSessions: []
        };
    }
    async revokeSession(userId, sessionId) {
        return { success: true };
    }
    async register(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        const user = new this.userModel({
            ...registerDto,
            password: hashedPassword,
        });
        await user.save();
        const { password, ...result } = user.toObject();
        return result;
    }
    async refreshToken(user) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        await this.userModel.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            lastLogout: null
        });
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                outletId: user.outletId,
            },
        };
    }
    async refreshTokenWithValidation(token) {
        try {
            let payload;
            try {
                payload = this.jwtService.verify(token);
            }
            catch (error) {
                if (error.name === 'TokenExpiredError') {
                    payload = this.jwtService.decode(token);
                    if (!payload || !payload.sub) {
                        throw new common_1.UnauthorizedException('Invalid token format');
                    }
                }
                else {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
            }
            const user = await this.userModel.findById(payload.sub).populate("outletId").exec();
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (user.lastLogout) {
                const tokenIssuedAt = new Date(payload.iat * 1000);
                if (tokenIssuedAt < user.lastLogout) {
                    throw new common_1.UnauthorizedException('Token was revoked');
                }
            }
            const newPayload = { email: user.email, sub: user._id, role: user.role };
            const newToken = this.jwtService.sign(newPayload);
            await this.userModel.findByIdAndUpdate(user._id, {
                lastLogin: new Date(),
                lastLogout: null
            });
            return {
                access_token: newToken,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    outletId: user.outletId,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token refresh failed');
        }
    }
    async findById(id) {
        try {
            return await this.userModel.findById(id).populate("outletId").exec();
        }
        catch (error) {
            console.error('Error in findById:', error);
            return await this.userModel.findById(id).exec();
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.userModel.findById(userId).populate("outletId").exec();
            if (!user) {
                throw new common_1.UnauthorizedException("User not found");
            }
            const { password, ...result } = user.toObject();
            return result;
        }
        catch (error) {
            console.error('Error in getProfile:', error);
            try {
                const user = await this.userModel.findById(userId).exec();
                if (!user) {
                    throw new common_1.UnauthorizedException("User not found");
                }
                const { password, ...result } = user.toObject();
                return result;
            }
            catch (fallbackError) {
                console.error('Fallback error in getProfile:', fallbackError);
                throw new common_1.UnauthorizedException("User not found");
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Function, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map