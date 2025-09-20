import { Injectable, ExecutionContext } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    console.log('[JWT Auth Guard] ===== GUARD ACTIVATED =====')
    const request = context.switchToHttp().getRequest()
    console.log('[JWT Auth Guard] Authorization header:', request.headers?.authorization)
    console.log('[JWT Auth Guard] Calling parent canActivate')
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('[JWT Auth Guard] ===== HANDLE REQUEST =====')
    console.log('[JWT Auth Guard] Error:', err)
    console.log('[JWT Auth Guard] User:', user ? 'Found' : 'Not found')
    console.log('[JWT Auth Guard] Info:', info)
    return super.handleRequest(err, user, info, context)
  }
}
