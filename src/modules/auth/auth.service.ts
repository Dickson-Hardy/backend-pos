import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import type { Model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { User, type UserDocument } from "../../schemas/user.schema"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select("+password")
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Update last login
    await this.userModel.findByIdAndUpdate(user._id, { 
      lastLogin: new Date(),
      lastLogout: null // Clear logout timestamp on new login
    })

    const payload = { email: user.email, sub: user._id, role: user.role }
    console.log('[Auth Service] Creating JWT with payload:', payload)
    console.log('[Auth Service] JWT Secret used:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
    console.log('[Auth Service] JWT Secret value:', (process.env.JWT_SECRET || "pharmacy-pos-secret").substring(0, 20) + '...')
    const token = this.jwtService.sign(payload)
    console.log('[Auth Service] Generated token length:', token.length)
    
    // Store active session info (in a real app, you might want to store this in Redis)
    // For now, we'll just track the last login
    
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
    }
  }

  async logout(userId: string) {
    // Update logout timestamp
    await this.userModel.findByIdAndUpdate(userId, { 
      lastLogout: new Date()
    })
    
    // In a production system, you would:
    // 1. Add the token to a blacklist/revocation list
    // 2. Remove from active sessions store (Redis)
    // 3. Clear any refresh tokens
    
    return { success: true }
  }

  async revokeToken(token: string) {
    // In a production system, add token to blacklist
    // For now, we'll decode the token to get user info and update logout time
    try {
      const decoded = this.jwtService.decode(token) as any
      if (decoded?.sub) {
        await this.userModel.findByIdAndUpdate(decoded.sub, { 
          lastLogout: new Date()
        })
      }
    } catch (error) {
      // Token might be invalid, but that's okay for revocation
    }
    
    return { success: true }
  }

  async revokeAllUserSessions(userId: string) {
    // Update logout timestamp to invalidate all sessions
    await this.userModel.findByIdAndUpdate(userId, { 
      lastLogout: new Date()
    })
    
    // In a production system, you would:
    // 1. Remove all user sessions from active sessions store
    // 2. Add all user tokens to blacklist
    // 3. Clear all refresh tokens for user
    
    return { success: true }
  }

  async getUserSessions(userId: string) {
    // In a production system, this would return active sessions from session store
    // For now, return basic user info with last login/logout
    const user = await this.userModel.findById(userId).select('lastLogin lastLogout')
    
    return {
      currentSession: {
        lastLogin: user?.lastLogin,
        lastLogout: user?.lastLogout
      },
      // In production, this would be actual session data
      activeSessions: []
    }
  }

  async revokeSession(userId: string, sessionId: string) {
    // In a production system, this would:
    // 1. Remove specific session from session store
    // 2. Add session token to blacklist
    // 3. Update session status in database
    
    // For now, we'll just return success
    return { success: true }
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12)

    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    })

    await user.save()

    const { password, ...result } = user.toObject()
    return result
  }

  async refreshToken(user: any) {
    // Generate a new token with the same payload
    const payload = { email: user.email, sub: user._id, role: user.role }
    
    // Update last activity and clear logout timestamp to ensure token validity
    await this.userModel.findByIdAndUpdate(user._id, { 
      lastLogin: new Date(),
      lastLogout: null // Clear logout timestamp on token refresh
    })
    
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
    }
  }

  async refreshTokenWithValidation(token: string) {
    try {
      // Verify the token, allowing expired tokens for refresh
      let payload: any
      try {
        payload = this.jwtService.verify(token)
      } catch (error: any) {
        // If token is expired, try to decode it without verification
        if (error.name === 'TokenExpiredError') {
          payload = this.jwtService.decode(token) as any
          if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid token format')
          }
        } else {
          throw new UnauthorizedException('Invalid token')
        }
      }

      // Find the user
      const user = await this.userModel.findById(payload.sub).populate("outletId").exec()
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      // Check if token was issued before user's last logout (if any)
      if (user.lastLogout) {
        const tokenIssuedAt = new Date(payload.iat * 1000) // JWT iat is in seconds
        if (tokenIssuedAt < user.lastLogout) {
          throw new UnauthorizedException('Token was revoked')
        }
      }

      // Generate new token
      const newPayload = { email: user.email, sub: user._id, role: user.role }
      const newToken = this.jwtService.sign(newPayload)
      
      // Update last activity and clear logout timestamp to ensure token validity
      await this.userModel.findByIdAndUpdate(user._id, { 
        lastLogin: new Date(),
        lastLogout: null // Clear logout timestamp on token refresh
      })
      
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
      }
    } catch (error) {
      throw new UnauthorizedException('Token refresh failed')
    }
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id).populate("outletId").exec()
    } catch (error) {
      console.error('Error in findById:', error)
      // If populate fails, try without populate
      return await this.userModel.findById(id).exec()
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userModel.findById(userId).populate("outletId").exec()
      if (!user) {
        throw new UnauthorizedException("User not found")
      }

      const { password, ...result } = user.toObject()
      return result
    } catch (error) {
      console.error('Error in getProfile:', error)
      // If populate fails, try without populate
      try {
        const user = await this.userModel.findById(userId).exec()
        if (!user) {
          throw new UnauthorizedException("User not found")
        }

        const { password, ...result } = user.toObject()
        return result
      } catch (fallbackError) {
        console.error('Fallback error in getProfile:', fallbackError)
        throw new UnauthorizedException("User not found")
      }
    }
  }
}
