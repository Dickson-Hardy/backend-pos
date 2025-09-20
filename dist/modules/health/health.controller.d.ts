import { Connection } from 'mongoose';
interface HealthResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    version: string;
    database: {
        connected: boolean;
        responseTime?: number;
    };
    services: {
        auth: boolean;
        api: boolean;
    };
}
export declare class HealthController {
    private readonly mongoConnection;
    constructor(mongoConnection: Connection);
    getHealth(): Promise<HealthResponse>;
}
export {};
