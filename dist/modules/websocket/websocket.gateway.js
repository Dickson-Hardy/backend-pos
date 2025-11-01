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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let WebsocketGateway = class WebsocketGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.connectedUsers = new Map();
        this.eventQueue = new Map();
        this.eventCounts = new Map();
        this.RATE_LIMIT = 100;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                console.log(`Client ${client.id} rejected: No token`);
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            const user = {
                userId: payload.sub,
                outletId: payload.outletId,
                role: payload.role,
                socketId: client.id,
                connectedAt: new Date(),
            };
            this.connectedUsers.set(client.id, user);
            client.data.user = user;
            console.log(`Client connected: ${client.id} (User: ${user.userId}, Outlet: ${user.outletId})`);
            if (user.outletId) {
                client.join(`outlet:${user.outletId}`);
            }
            this.emitPresenceUpdate(user.outletId);
            this.sendQueuedEvents(client.id);
        }
        catch (error) {
            console.log(`Client ${client.id} authentication failed:`, error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            console.log(`Client disconnected: ${client.id} (User: ${user.userId})`);
            this.connectedUsers.delete(client.id);
            this.emitPresenceUpdate(user.outletId);
        }
    }
    handleJoinOutlet(client, outletId) {
        client.join(`outlet:${outletId}`);
        return { success: true };
    }
    emitToOutlet(outletId, event, data) {
        if (!this.checkRateLimit(outletId, event)) {
            console.warn(`Rate limit exceeded for outlet ${outletId}, event ${event}`);
            return;
        }
        const compressedData = this.compressData(data);
        this.server.to(`outlet:${outletId}`).emit(event, compressedData);
        this.logEvent(outletId, event);
    }
    emitToAll(event, data) {
        const compressedData = this.compressData(data);
        this.server.emit(event, compressedData);
    }
    emitToUser(userId, event, data) {
        const user = Array.from(this.connectedUsers.values()).find(u => u.userId === userId);
        if (user) {
            this.server.to(user.socketId).emit(event, data);
        }
    }
    getConnectedUsers(outletId) {
        const users = Array.from(this.connectedUsers.values());
        return outletId ? users.filter(u => u.outletId === outletId) : users;
    }
    getMetrics() {
        return {
            totalConnections: this.connectedUsers.size,
            connectionsByOutlet: this.getConnectionsByOutlet(),
            eventCounts: Object.fromEntries(this.eventCounts),
            uptime: process.uptime(),
        };
    }
    emitPresenceUpdate(outletId) {
        const users = this.getConnectedUsers(outletId);
        this.emitToOutlet(outletId, 'presence:update', {
            onlineUsers: users.map(u => ({
                userId: u.userId,
                role: u.role,
                connectedAt: u.connectedAt,
            })),
            count: users.length,
        });
    }
    getConnectionsByOutlet() {
        const byOutlet = {};
        this.connectedUsers.forEach(user => {
            byOutlet[user.outletId] = (byOutlet[user.outletId] || 0) + 1;
        });
        return byOutlet;
    }
    checkRateLimit(outletId, event) {
        const key = `${outletId}:${event}`;
        const now = Date.now();
        const count = this.eventCounts.get(key) || 0;
        if (count >= this.RATE_LIMIT) {
            return false;
        }
        this.eventCounts.set(key, count + 1);
        setTimeout(() => {
            this.eventCounts.delete(key);
        }, 60000);
        return true;
    }
    compressData(data) {
        if (Array.isArray(data)) {
            return data.slice(0, 100);
        }
        if (typeof data === 'object' && data !== null) {
            const compressed = {};
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    compressed[key] = data[key];
                }
            });
            return compressed;
        }
        return data;
    }
    logEvent(outletId, event) {
        const key = `${outletId}:${event}`;
        const count = this.eventCounts.get(key) || 0;
        this.eventCounts.set(key, count + 1);
    }
    sendQueuedEvents(socketId) {
        const queue = this.eventQueue.get(socketId);
        if (queue && queue.length > 0) {
            const socket = this.server.sockets.sockets.get(socketId);
            if (socket) {
                queue.forEach(({ event, data }) => {
                    socket.emit(event, data);
                });
            }
            this.eventQueue.delete(socketId);
        }
    }
    queueEvent(userId, event, data) {
        const user = Array.from(this.connectedUsers.values()).find(u => u.userId === userId);
        if (user) {
            const queue = this.eventQueue.get(user.socketId) || [];
            queue.push({ event, data });
            this.eventQueue.set(user.socketId, queue);
        }
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-outlet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinOutlet", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map