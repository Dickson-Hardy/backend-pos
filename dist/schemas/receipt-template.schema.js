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
exports.ReceiptTemplateSchema = exports.ReceiptTemplate = exports.PrinterConfiguration = exports.PaperConfiguration = exports.ReceiptElement = exports.FontStyle = exports.FontSize = exports.TextAlignment = exports.TemplateStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TemplateStatus;
(function (TemplateStatus) {
    TemplateStatus["ACTIVE"] = "active";
    TemplateStatus["INACTIVE"] = "inactive";
    TemplateStatus["DRAFT"] = "draft";
})(TemplateStatus || (exports.TemplateStatus = TemplateStatus = {}));
var TextAlignment;
(function (TextAlignment) {
    TextAlignment["LEFT"] = "left";
    TextAlignment["CENTER"] = "center";
    TextAlignment["RIGHT"] = "right";
})(TextAlignment || (exports.TextAlignment = TextAlignment = {}));
var FontSize;
(function (FontSize) {
    FontSize["SMALL"] = "small";
    FontSize["MEDIUM"] = "medium";
    FontSize["LARGE"] = "large";
})(FontSize || (exports.FontSize = FontSize = {}));
var FontStyle;
(function (FontStyle) {
    FontStyle["NORMAL"] = "normal";
    FontStyle["BOLD"] = "bold";
    FontStyle["UNDERLINE"] = "underline";
    FontStyle["ITALIC"] = "italic";
})(FontStyle || (exports.FontStyle = FontStyle = {}));
let ReceiptElement = class ReceiptElement {
};
exports.ReceiptElement = ReceiptElement;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReceiptElement.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReceiptElement.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: TextAlignment, default: TextAlignment.LEFT }),
    __metadata("design:type", String)
], ReceiptElement.prototype, "alignment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: FontSize, default: FontSize.MEDIUM }),
    __metadata("design:type", String)
], ReceiptElement.prototype, "fontSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: FontStyle, default: FontStyle.NORMAL }),
    __metadata("design:type", String)
], ReceiptElement.prototype, "fontStyle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ReceiptElement.prototype, "bold", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ReceiptElement.prototype, "underline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], ReceiptElement.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ReceiptElement.prototype, "marginTop", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ReceiptElement.prototype, "marginBottom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], ReceiptElement.prototype, "properties", void 0);
exports.ReceiptElement = ReceiptElement = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReceiptElement);
let PaperConfiguration = class PaperConfiguration {
};
exports.PaperConfiguration = PaperConfiguration;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaperConfiguration.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'mm' }),
    __metadata("design:type", String)
], PaperConfiguration.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 210 }),
    __metadata("design:type", Number)
], PaperConfiguration.prototype, "physicalWidth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 297 }),
    __metadata("design:type", Number)
], PaperConfiguration.prototype, "physicalHeight", void 0);
exports.PaperConfiguration = PaperConfiguration = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaperConfiguration);
let PrinterConfiguration = class PrinterConfiguration {
};
exports.PrinterConfiguration = PrinterConfiguration;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PrinterConfiguration.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PrinterConfiguration.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PrinterConfiguration.prototype, "connectionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'ESC/POS' }),
    __metadata("design:type", String)
], PrinterConfiguration.prototype, "commandSet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], PrinterConfiguration.prototype, "settings", void 0);
exports.PrinterConfiguration = PrinterConfiguration = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PrinterConfiguration);
let ReceiptTemplate = class ReceiptTemplate {
};
exports.ReceiptTemplate = ReceiptTemplate;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReceiptTemplate.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReceiptTemplate.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: TemplateStatus, default: TemplateStatus.DRAFT }),
    __metadata("design:type", String)
], ReceiptTemplate.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Outlet', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReceiptTemplate.prototype, "outletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReceiptTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReceiptTemplate.prototype, "modifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], ReceiptTemplate.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ReceiptElement], default: [] }),
    __metadata("design:type", Array)
], ReceiptTemplate.prototype, "elements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaperConfiguration, required: true }),
    __metadata("design:type", PaperConfiguration)
], ReceiptTemplate.prototype, "paperConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PrinterConfiguration, required: true }),
    __metadata("design:type", PrinterConfiguration)
], ReceiptTemplate.prototype, "printerConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ReceiptTemplate.prototype, "isDefault", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ReceiptTemplate.prototype, "isSystem", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ReceiptTemplate.prototype, "availableVariables", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], ReceiptTemplate.prototype, "metadata", void 0);
exports.ReceiptTemplate = ReceiptTemplate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ReceiptTemplate);
exports.ReceiptTemplateSchema = mongoose_1.SchemaFactory.createForClass(ReceiptTemplate);
exports.ReceiptTemplateSchema.index({ outletId: 1, status: 1 });
exports.ReceiptTemplateSchema.index({ outletId: 1, isDefault: 1 });
exports.ReceiptTemplateSchema.index({ isSystem: 1 });
//# sourceMappingURL=receipt-template.schema.js.map