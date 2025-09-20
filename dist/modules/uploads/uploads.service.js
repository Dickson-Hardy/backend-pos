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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let UploadsService = class UploadsService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file, folder = "pharmacy-pos") {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder,
                resource_type: "image",
                transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "webp" }],
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result.secure_url);
                }
            })
                .end(file.buffer);
        });
    }
    async uploadDocument(file, folder = "pharmacy-pos/documents") {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder,
                resource_type: "raw",
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result.secure_url);
                }
            })
                .end(file.buffer);
        });
    }
    async deleteFile(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map