import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export interface ConnectedUser {
    userId: string;
    outletId: string;
    role: string;
    socketId: string;
    connectedAt: Date;
}
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private connectedUsers;
    private eventQueue;
    private eventCounts;
    private readonly RATE_LIMIT;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinOutlet(client: Socket, outletId: string): {
        success: boolean;
    };
    emitToOutlet(outletId: string, event: string, data: any): void;
    emitToAll(event: string, data: any): void;
    emitToUser(userId: string, event: string, data: any): void;
    getConnectedUsers(outletId?: string): ConnectedUser[];
    getMetrics(): {
        totalConnections: number;
        connectionsByOutlet: Record<string, number>;
        eventCounts: {
            [k: string]: number;
        };
        uptime: number;
    };
    private emitPresenceUpdate;
    private getConnectionsByOutlet;
    private checkRateLimit;
    private compressData;
    private logEvent;
    private sendQueuedEvents;
    queueEvent(userId: string, event: string, data: any): void;
}
