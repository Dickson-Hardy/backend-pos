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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../../schemas/user.schema");
const JWT_SECRET = process.env.JWT_SECRET || "pharmacy-pos-secret";
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(userModel) {
        console.log('[JWT Strategy] ===== CONSTRUCTOR CALLED =====');
        console.log('[JWT Strategy] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
        console.log('[JWT Strategy] JWT_SECRET value:', JWT_SECRET.substring(0, 20) + '...');
        const jwtExtractor = (req) => {
            console.log('[JWT Strategy] ===== JWT EXTRACTOR CALLED =====');
            console.log('[JWT Strategy] Authorization header:', req.headers?.authorization);
            const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            console.log('[JWT Strategy] Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');
            return token;
        };
        super({
            jwtFromRequest: jwtExtractor,
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
            algorithms: ['HS256'],
        });
        this.userModel = userModel;
        console.log('[JWT Strategy] ===== CONSTRUCTOR COMPLETE =====');
    }
    async validate(payload) {
        console.log('[JWT Strategy] ===== VALIDATE CALLED =====');
        console.log('[JWT Strategy] Payload received:', JSON.stringify(payload, null, 2));
        try {
            const user = await this.userModel.findById(payload.sub).exec();
            if (!user) {
                console.log('[JWT Strategy] ❌ User not found for ID:', payload.sub);
                return null;
            }
            console.log('[JWT Strategy] ✅ User found:', user.email);
            return user;
        }
        catch (error) {
            console.log('[JWT Strategy] ❌ Error in validate:', error);
            return null;
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map