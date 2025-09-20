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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadFile(file) {
        const fileType = file.mimetype.startsWith("image/") ? "image" : "document";
        const url = fileType === "image"
            ? await this.uploadsService.uploadImage(file)
            : await this.uploadsService.uploadDocument(file);
        return { url };
    }
    async uploadImage(file) {
        const url = await this.uploadsService.uploadImage(file);
        return { url };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Upload file" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)("image"),
    (0, swagger_1.ApiOperation)({ summary: "Upload image file" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadImage", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)("uploads"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("uploads"),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map