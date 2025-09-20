import { Controller, Post, Get, UseGuards, Request, Body, Param, Delete, UnauthorizedException } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "User login" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  async refresh(@Request() req: any) {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided')
    }
    
    const token = authHeader.replace('Bearer ', '')
    return this.authService.refreshTokenWithValidation(token)
  }

  @Post("logout")
  @ApiOperation({ summary: "User logout" })
  async logout(@Request() req: any) {
    // Extract user ID from JWT if available
    const userId = req.user?.id
    if (userId) {
      await this.authService.logout(userId)
    }
    return { message: "Logged out successfully" }
  }

  @Post("revoke-token")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke current token" })
  async revokeToken(@Request() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      await this.authService.revokeToken(token)
    }
    return { message: "Token revoked successfully" }
  }

  @Post("revoke-all-sessions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke all user sessions" })
  async revokeAllSessions(@Request() req: any) {
    await this.authService.revokeAllUserSessions(req.user.id)
    return { message: "All sessions revoked successfully" }
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user active sessions" })
  async getUserSessions(@Request() req: any) {
    return this.authService.getUserSessions(req.user.id)
  }

  @Delete("sessions/:sessionId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke specific session" })
  async revokeSession(@Request() req: any, @Param("sessionId") sessionId: string) {
    await this.authService.revokeSession(req.user.id, sessionId)
    return { message: "Session revoked successfully" }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id)
  }

  @Get("test-no-auth")
  @ApiOperation({ summary: "Test endpoint without authentication" })
  async testNoAuth() {
    return { message: "This endpoint works without authentication", timestamp: new Date() }
  }
}