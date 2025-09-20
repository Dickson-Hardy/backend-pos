import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LocalStrategy } from "./strategies/local.strategy"
import { User, UserSchema } from "../../schemas/user.schema"

// Use environment variable with proper fallback
const JWT_SECRET = process.env.JWT_SECRET || "pharmacy-pos-secret"
console.log('[Auth Module] JWT_SECRET loaded:', JWT_SECRET ? JWT_SECRET.substring(0, 20) + '...' : 'NOT SET')

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "16h" }, // 16 hours for pharmacy operations
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
