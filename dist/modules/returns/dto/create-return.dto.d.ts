import { ReturnReason, RefundMethod } from "../../../schemas/return.schema";
export declare class ReturnItemDto {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalRefund: number;
    reason: ReturnReason;
    batchNumber?: string;
}
export declare class CreateReturnDto {
    originalSaleId: string;
    originalReceiptNumber: string;
    outletId: string;
    items: ReturnItemDto[];
    totalRefundAmount: number;
    refundMethod: RefundMethod;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
}
