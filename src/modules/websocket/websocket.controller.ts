import { Controller, Get, UseGuards } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('websocket')
@UseGuards(JwtAuthGuard)
export class WebsocketController {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  @Get('metrics')
  getMetrics() {
    return this.websocketGateway.getMetrics()
  }

  @Get('users')
  getConnectedUsers() {
    return {
      users: this.websocketGateway.getConnectedUsers(),
      total: this.websocketGateway.getConnectedUsers().length,
    }
  }

  @Get('users/:outletId')
  getConnectedUsersByOutlet(outletId: string) {
    return {
      users: this.websocketGateway.getConnectedUsers(outletId),
      total: this.websocketGateway.getConnectedUsers(outletId).length,
    }
  }
}
