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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = class EmailService {
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async sendWelcomeEmail(to, firstName, tempPassword) {
        await this.resend.emails.send({
            from: process.env.FROM_EMAIL || "noreply@pharmacy-pos.com",
            to,
            subject: "Welcome to Pharmacy POS System",
            html: `
        <h2>Welcome to Pharmacy POS System</h2>
        <p>Hello ${firstName},</p>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please log in and change your password immediately.</p>
        <p>Best regards,<br>Pharmacy POS Team</p>
      `,
        });
    }
    async sendPasswordResetEmail(to, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await this.resend.emails.send({
            from: process.env.FROM_EMAIL || "noreply@pharmacy-pos.com",
            to,
            subject: "Password Reset Request",
            html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        });
    }
    async sendLowStockAlert(to, products) {
        const productList = products.map((p) => `<li>${p.name} - Current Stock: ${p.stockQuantity}</li>`).join("");
        await this.resend.emails.send({
            from: process.env.FROM_EMAIL || "noreply@pharmacy-pos.com",
            to,
            subject: "Low Stock Alert - Pharmacy POS",
            html: `
        <h2>Low Stock Alert</h2>
        <p>The following products are running low on stock:</p>
        <ul>${productList}</ul>
        <p>Please reorder these items as soon as possible.</p>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map