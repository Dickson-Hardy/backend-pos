import { type Document, Types } from "mongoose";
export type ReconciliationDocument = Reconciliation & Document;
export declare enum ReconciliationType {
    DAILY_CASH = "daily_cash",
    SHIFT_RECONCILIATION = "shift_reconciliation",
    BANK_RECONCILIATION = "bank_reconciliation",
    INVENTORY_COUNT = "inventory_count",
    PAYMENT_RECONCILIATION = "payment_reconciliation"
}
export declare enum ReconciliationStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    APPROVED = "approved",
    VARIANCE_FOUND = "variance_found",
    REQUIRES_REVIEW = "requires_review"
}
export declare class CashBreakdown {
    hundreds: number;
    fifties: number;
    twenties: number;
    tens: number;
    fives: number;
    ones: number;
    quarters: number;
    dimes: number;
    nickels: number;
    pennies: number;
    totalCounted: number;
}
export declare class DailyCashData {
    startingCash: number;
    expectedCash: number;
    actualCashCount: CashBreakdown;
    actualCashTotal: number;
    variance: number;
    cashSales: number;
    cashRefunds: number;
    cashPayouts: number;
    tillFloat: number;
    depositAmount: number;
    varianceNotes: string;
}
export declare class BankReconciliationData {
    statementDate: Date;
    statementBalance: number;
    bookBalance: number;
    reconciledBalance: number;
    outstandingDeposits: Array<{
        date: Date;
        amount: number;
        reference: string;
        description: string;
    }>;
    outstandingWithdrawals: Array<{
        date: Date;
        amount: number;
        reference: string;
        description: string;
    }>;
    bankAdjustments: Array<{
        date: Date;
        amount: number;
        type: 'fee' | 'interest' | 'charge' | 'credit';
        description: string;
    }>;
    variance: number;
}
export declare class InventoryReconciliationItem {
    productId: Types.ObjectId;
    productName: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
    unitCost: number;
    varianceValue: number;
    batchNumber: string;
    expiryDate: Date;
    reason: string;
    location: string;
}
export declare class PaymentReconciliationData {
    expectedTotals: {
        cash: number;
        creditCard: number;
        debitCard: number;
        check: number;
        giftCard: number;
        insurance: number;
        other: number;
    };
    actualTotals: {
        cash: number;
        creditCard: number;
        debitCard: number;
        check: number;
        giftCard: number;
        insurance: number;
        other: number;
    };
    variances: {
        cash: number;
        creditCard: number;
        debitCard: number;
        check: number;
        giftCard: number;
        insurance: number;
        other: number;
    };
    creditCardBatches: Array<{
        batchNumber: string;
        amount: number;
        transactionCount: number;
        processor: string;
        settlementDate: Date;
    }>;
}
export declare class Reconciliation {
    type: ReconciliationType;
    status: ReconciliationStatus;
    outletId: Types.ObjectId;
    performedBy: Types.ObjectId;
    reviewedBy: Types.ObjectId;
    approvedBy: Types.ObjectId;
    reconciliationDate: Date;
    periodStart: Date;
    periodEnd: Date;
    cashData: DailyCashData;
    bankData: BankReconciliationData;
    inventoryItems: InventoryReconciliationItem[];
    paymentData: PaymentReconciliationData;
    totalVariance: number;
    hasSignificantVariance: boolean;
    varianceThreshold: number;
    notes: string;
    managerNotes: string;
    attachments: string[];
    completedAt: Date;
    reviewedAt: Date;
    approvedAt: Date;
    auditTrail: Array<{
        action: string;
        performedBy: Types.ObjectId;
        timestamp: Date;
        details: string;
        oldValues?: Record<string, any>;
        newValues?: Record<string, any>;
    }>;
}
export declare const ReconciliationSchema: import("mongoose").Schema<Reconciliation, import("mongoose").Model<Reconciliation, any, any, any, Document<unknown, any, Reconciliation> & Reconciliation & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reconciliation, Document<unknown, {}, import("mongoose").FlatRecord<Reconciliation>> & import("mongoose").FlatRecord<Reconciliation> & {
    _id: Types.ObjectId;
}>;
