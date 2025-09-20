import type { Model } from 'mongoose';
import { Reconciliation, type ReconciliationDocument, ReconciliationType, ReconciliationStatus } from '../../schemas/reconciliation.schema';
import { type SaleDocument } from '../../schemas/sale.schema';
import { type ProductDocument } from '../../schemas/product.schema';
export declare class ReconciliationService {
    private reconciliationModel;
    private saleModel;
    private productModel;
    constructor(reconciliationModel: Model<ReconciliationDocument>, saleModel: Model<SaleDocument>, productModel: Model<ProductDocument>);
    startDailyCashReconciliation(data: {
        outletId: string;
        performedBy: string;
        reconciliationDate: Date;
        startingCash: number;
    }): Promise<Reconciliation>;
    submitCashCount(reconciliationId: string, cashCount: {
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
    }, performedBy: string): Promise<Reconciliation>;
    createShiftReconciliation(data: {
        outletId: string;
        performedBy: string;
        shiftStart: Date;
        shiftEnd: Date;
        startingCash: number;
    }): Promise<Reconciliation>;
    createBankReconciliation(data: {
        outletId: string;
        performedBy: string;
        statementDate: Date;
        statementBalance: number;
        bookBalance: number;
    }): Promise<Reconciliation>;
    addBankReconciliationItem(reconciliationId: string, item: {
        type: 'deposit' | 'withdrawal' | 'adjustment';
        date: Date;
        amount: number;
        reference: string;
        description: string;
        adjustmentType?: 'fee' | 'interest' | 'charge' | 'credit';
    }): Promise<Reconciliation>;
    createInventoryReconciliation(data: {
        outletId: string;
        performedBy: string;
        productIds: string[];
    }): Promise<Reconciliation>;
    updateInventoryCount(reconciliationId: string, updates: Array<{
        productId: string;
        countedQuantity: number;
        batchNumber?: string;
        location?: string;
        reason?: string;
    }>): Promise<Reconciliation>;
    findAll(filters: {
        outletId?: string;
        type?: ReconciliationType;
        status?: ReconciliationStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Reconciliation[]>;
    findOne(id: string): Promise<Reconciliation>;
    approveReconciliation(id: string, approvedBy: string, notes?: string): Promise<Reconciliation>;
    getReconciliationSummary(outletId: string, startDate: Date, endDate: Date): Promise<{
        totalReconciliations: number;
        byType: {};
        byStatus: {};
        totalVariance: number;
        significantVariances: number;
        avgVariance: number;
    }>;
    private calculateDailySalesData;
    private calculatePaymentTotals;
}
