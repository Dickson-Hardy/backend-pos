import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'

export interface ConnectedUser {
  userId: string
  outletId: string
  role: string
  socketId: string
  connectedAt: Date
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private connectedUsers: Map<string, ConnectedUser> = new Map()
  private eventQueue: Map<string, any[]> = new Map()
  private eventCounts: Map<string, number> = new Map()
  private readonly RATE_LIMIT = 100 // events per minute

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1]
      
      if (!token) {
        console.log(`Client ${client.id} rejected: No token`)
        client.disconnect()
        return
      }

      const payload = await this.jwtService.verifyAsync(token)
      const user: ConnectedUser = {
        userId: payload.sub,
        outletId: payload.outletId,
        role: payload.role,
        socketId: client.id,
        connectedAt: new Date(),
      }

      this.connectedUsers.set(client.id, user)
      client.data.user = user

      console.log(`Client connected: ${client.id} (User: ${user.userId}, Outlet: ${user.outletId})`)
      
      // Auto-join outlet room
      if (user.outletId) {
        client.join(`outlet:${user.outletId}`)
      }

      // Emit presence update
      this.emitPresenceUpdate(user.outletId)

      // Send queued events if any
      this.sendQueuedEvents(client.id)
    } catch (error) {
      console.log(`Client ${client.id} authentication failed:`, error.message)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id)
    if (user) {
      console.log(`Client disconnected: ${client.id} (User: ${user.userId})`)
      this.connectedUsers.delete(client.id)
      this.emitPresenceUpdate(user.outletId)
    }
  }

  @SubscribeMessage('join-outlet')
  handleJoinOutlet(client: Socket, outletId: string) {
    client.join(`outlet:${outletId}`)
    return { success: true }
  }

  emitToOutlet(outletId: string, event: string, data: any) {
    if (!this.checkRateLimit(outletId, event)) {
      console.warn(`Rate limit exceeded for outlet ${outletId}, event ${event}`)
      return
    }

    const compressedData = this.compressData(data)
    this.server.to(`outlet:${outletId}`).emit(event, compressedData)
    this.logEvent(outletId, event)
  }

  emitToAll(event: string, data: any) {
    const compressedData = this.compressData(data)
    this.server.emit(event, compressedData)
  }

  emitToUser(userId: string, event: string, data: any) {
    const user = Array.from(this.connectedUsers.values()).find(u => u.userId === userId)
    if (user) {
      this.server.to(user.socketId).emit(event, data)
    }
  }

  getConnectedUsers(outletId?: string): ConnectedUser[] {
    const users = Array.from(this.connectedUsers.values())
    return outletId ? users.filter(u => u.outletId === outletId) : users
  }

  getMetrics() {
    return {
      totalConnections: this.connectedUsers.size,
      connectionsByOutlet: this.getConnectionsByOutlet(),
      eventCounts: Object.fromEntries(this.eventCounts),
      uptime: process.uptime(),
    }
  }

  private emitPresenceUpdate(outletId: string) {
    const users = this.getConnectedUsers(outletId)
    this.emitToOutlet(outletId, 'presence:update', {
      onlineUsers: users.map(u => ({
        userId: u.userId,
        role: u.role,
        connectedAt: u.connectedAt,
      })),
      count: users.length,
    })
  }

  private getConnectionsByOutlet() {
    const byOutlet: Record<string, number> = {}
    this.connectedUsers.forEach(user => {
      byOutlet[user.outletId] = (byOutlet[user.outletId] || 0) + 1
    })
    return byOutlet
  }

  private checkRateLimit(outletId: string, event: string): boolean {
    const key = `${outletId}:${event}`
    const now = Date.now()
    const count = this.eventCounts.get(key) || 0
    
    if (count >= this.RATE_LIMIT) {
      return false
    }
    
    this.eventCounts.set(key, count + 1)
    
    // Reset counter after 1 minute
    setTimeout(() => {
      this.eventCounts.delete(key)
    }, 60000)
    
    return true
  }

  private compressData(data: any): any {
    // Simple compression: remove null/undefined, truncate arrays
    if (Array.isArray(data)) {
      return data.slice(0, 100) // Limit array size
    }
    if (typeof data === 'object' && data !== null) {
      const compressed: any = {}
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          compressed[key] = data[key]
        }
      })
      return compressed
    }
    return data
  }

  private logEvent(outletId: string, event: string) {
    // Simple event logging for monitoring
    const key = `${outletId}:${event}`
    const count = this.eventCounts.get(key) || 0
    this.eventCounts.set(key, count + 1)
  }

  private sendQueuedEvents(socketId: string) {
    const queue = this.eventQueue.get(socketId)
    if (queue && queue.length > 0) {
      const socket = this.server.sockets.sockets.get(socketId)
      if (socket) {
        queue.forEach(({ event, data }) => {
          socket.emit(event, data)
        })
      }
      this.eventQueue.delete(socketId)
    }
  }

  queueEvent(userId: string, event: string, data: any) {
    const user = Array.from(this.connectedUsers.values()).find(u => u.userId === userId)
    if (user) {
      const queue = this.eventQueue.get(user.socketId) || []
      queue.push({ event, data })
      this.eventQueue.set(user.socketId, queue)
    }
  }
}
