import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "../../../schemas/user.schema"

// Use the same environment variable loading as auth.module.ts
const JWT_SECRET = process.env.JWT_SECRET || "pharmacy-pos-secret"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    console.log('[JWT Strategy] ===== CONSTRUCTOR CALLED =====')
    console.log('[JWT Strategy] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
    console.log('[JWT Strategy] JWT_SECRET value:', JWT_SECRET.substring(0, 20) + '...')
    
    // Create custom JWT extractor with debugging
    const jwtExtractor = (req: any) => {
      console.log('[JWT Strategy] ===== JWT EXTRACTOR CALLED =====')
      console.log('[JWT Strategy] Authorization header:', req.headers?.authorization)
      
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
      console.log('[JWT Strategy] Extracted token:', token ? `${token.substring(0, 20)}...` : 'null')
      return token
    }
    
    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      // Add verification options for debugging
      algorithms: ['HS256'],
    })
    console.log('[JWT Strategy] ===== CONSTRUCTOR COMPLETE =====')
  }

  async validate(payload: any) {
    console.log('[JWT Strategy] ===== VALIDATE CALLED =====')
    console.log('[JWT Strategy] Payload received:', JSON.stringify(payload, null, 2))
    
    try {
      // Simple validation - just return the payload for now
      const user = await this.userModel.findById(payload.sub).exec()
      if (!user) {
        console.log('[JWT Strategy] ❌ User not found for ID:', payload.sub)
        return null
      }
      
      console.log('[JWT Strategy] ✅ User found:', user.email)
      return user
    } catch (error) {
      console.log('[JWT Strategy] ❌ Error in validate:', error)
      return null
    }
  }
}
