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
exports.OutletsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const outlet_schema_1 = require("../../schemas/outlet.schema");
let OutletsService = class OutletsService {
    constructor(outletModel) {
        this.outletModel = outletModel;
    }
    async create(createOutletDto) {
        const outlet = new this.outletModel(createOutletDto);
        return outlet.save();
    }
    async findAll() {
        return this.outletModel.find().populate("managerId").exec();
    }
    async findOne(id) {
        const outlet = await this.outletModel.findById(id).populate("managerId").exec();
        if (!outlet) {
            throw new common_1.NotFoundException("Outlet not found");
        }
        return outlet;
    }
    async update(id, updateOutletDto) {
        const outlet = await this.outletModel.findByIdAndUpdate(id, updateOutletDto, { new: true }).exec();
        if (!outlet) {
            throw new common_1.NotFoundException("Outlet not found");
        }
        return outlet;
    }
    async remove(id) {
        const result = await this.outletModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("Outlet not found");
        }
    }
};
exports.OutletsService = OutletsService;
exports.OutletsService = OutletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(outlet_schema_1.Outlet.name)),
    __metadata("design:paramtypes", [Function])
], OutletsService);
//# sourceMappingURL=outlets.service.js.map