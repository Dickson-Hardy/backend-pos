import { WebsocketGateway } from './websocket.gateway';
export declare class WebsocketController {
    private readonly websocketGateway;
    constructor(websocketGateway: WebsocketGateway);
    getMetrics(): {
        totalConnections: number;
        connectionsByOutlet: Record<string, number>;
        eventCounts: {
            [k: string]: number;
        };
        uptime: number;
    };
    getConnectedUsers(): {
        users: import("./websocket.gateway").ConnectedUser[];
        total: number;
    };
    getConnectedUsersByOutlet(outletId: string): {
        users: import("./websocket.gateway").ConnectedUser[];
        total: number;
    };
}
