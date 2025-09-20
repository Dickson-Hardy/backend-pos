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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HealthController = class HealthController {
    constructor(mongoConnection) {
        this.mongoConnection = mongoConnection;
    }
    async getHealth() {
        const startTime = Date.now();
        let dbConnected = false;
        let dbResponseTime;
        try {
            await this.mongoConnection.db.admin().ping();
            dbConnected = true;
            dbResponseTime = Date.now() - startTime;
        }
        catch (error) {
            console.error('Database health check failed:', error);
            dbConnected = false;
        }
        const healthStatus = {
            status: dbConnected ? 'ok' : 'error',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            database: {
                connected: dbConnected,
                responseTime: dbResponseTime
            },
            services: {
                auth: true,
                api: true
            }
        };
        return healthStatus;
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is healthy',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                uptime: { type: 'number', example: 123.456 },
                version: { type: 'string', example: '1.0.0' },
                database: {
                    type: 'object',
                    properties: {
                        connected: { type: 'boolean', example: true },
                        responseTime: { type: 'number', example: 5 }
                    }
                },
                services: {
                    type: 'object',
                    properties: {
                        auth: { type: 'boolean', example: true },
                        api: { type: 'boolean', example: true }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], HealthController);
//# sourceMappingURL=health.controller.js.map