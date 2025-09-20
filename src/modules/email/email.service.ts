import { Injectable } from "@nestjs/common"
import { Resend } from "resend"

@Injectable()
export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendWelcomeEmail(to: string, firstName: string, tempPassword: string) {
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
    })
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

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
    })
  }

  async sendLowStockAlert(to: string, products: any[]) {
    const productList = products.map((p) => `<li>${p.name} - Current Stock: ${p.stockQuantity}</li>`).join("")

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
    })
  }
}