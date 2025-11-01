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
exports.WebsocketController = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("./websocket.gateway");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WebsocketController = class WebsocketController {
    constructor(websocketGateway) {
        this.websocketGateway = websocketGateway;
    }
    getMetrics() {
        return this.websocketGateway.getMetrics();
    }
    getConnectedUsers() {
        return {
            users: this.websocketGateway.getConnectedUsers(),
            total: this.websocketGateway.getConnectedUsers().length,
        };
    }
    getConnectedUsersByOutlet(outletId) {
        return {
            users: this.websocketGateway.getConnectedUsers(outletId),
            total: this.websocketGateway.getConnectedUsers(outletId).length,
        };
    }
};
exports.WebsocketController = WebsocketController;
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getConnectedUsers", null);
__decorate([
    (0, common_1.Get)('users/:outletId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getConnectedUsersByOutlet", null);
exports.WebsocketController = WebsocketController = __decorate([
    (0, common_1.Controller)('websocket'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [websocket_gateway_1.WebsocketGateway])
], WebsocketController);
//# sourceMappingURL=websocket.controller.js.map