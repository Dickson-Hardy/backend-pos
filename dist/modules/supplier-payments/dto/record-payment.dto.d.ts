import { PaymentMethod } from "../../../schemas/supplier-payment.schema";
export declare class RecordPaymentDto {
    amount: number;
    paymentMethod: PaymentMethod;
    paidDate: string;
    referenceNumber?: string;
    notes?: string;
}
