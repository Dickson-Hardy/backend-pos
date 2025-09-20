export declare class EmailService {
    private resend;
    constructor();
    sendWelcomeEmail(to: string, firstName: string, tempPassword: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
    sendLowStockAlert(to: string, products: any[]): Promise<void>;
}
