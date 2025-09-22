export declare class CreateExpenseDto {
    amount: number;
    description: string;
    category: 'operational' | 'maintenance' | 'supplies' | 'other';
    receiptNumber?: string;
    notes?: string;
}
