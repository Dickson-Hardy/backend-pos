import { ReconciliationService } from './reconciliation.service';
import { ReconciliationType, ReconciliationStatus } from '../../schemas/reconciliation.schema';
export declare class ReconciliationController {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    startDailyCashReconciliation(body: {
        outletId: string;
        reconciliationDate: string;
        startingCash: number;
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    submitCashCount(id: string, body: {
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
        notes?: string;
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    createShiftReconciliation(body: {
        outletId: string;
        shiftStart: string;
        shiftEnd: string;
        startingCash: number;
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    createBankReconciliation(body: {
        outletId: string;
        statementDate: string;
        statementBalance: number;
        bookBalance: number;
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    addBankReconciliationItem(id: string, body: {
        type: 'deposit' | 'withdrawal' | 'adjustment';
        date: string;
        amount: number;
        reference: string;
        description: string;
        adjustmentType?: 'fee' | 'interest' | 'charge' | 'credit';
    }): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    createInventoryReconciliation(body: {
        outletId: string;
        productIds: string[];
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    updateInventoryCount(id: string, body: {
        updates: Array<{
            productId: string;
            countedQuantity: number;
            batchNumber?: string;
            location?: string;
            reason?: string;
        }>;
    }): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    findAll(outletId?: string, type?: ReconciliationType, status?: ReconciliationStatus, startDate?: string, endDate?: string): Promise<import("../../schemas/reconciliation.schema").Reconciliation[]>;
    getReconciliationSummary(outletId: string, startDate: string, endDate: string): Promise<{
        totalReconciliations: number;
        byType: {};
        byStatus: {};
        totalVariance: number;
        significantVariances: number;
        avgVariance: number;
    }>;
    findOne(id: string): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    approveReconciliation(id: string, body: {
        notes?: string;
    }, req: any): Promise<import("../../schemas/reconciliation.schema").Reconciliation>;
    getSignificantVariances(outletId?: string, days?: string): Promise<import("../../schemas/reconciliation.schema").Reconciliation[]>;
    getPendingReconciliations(outletId?: string): Promise<import("../../schemas/reconciliation.schema").Reconciliation[]>;
}
