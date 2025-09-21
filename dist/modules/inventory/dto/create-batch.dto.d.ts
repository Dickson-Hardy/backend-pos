export declare class CreateBatchDto {
    batchNumber: string;
    productId: string;
    outletId: string;
    manufacturingDate: string;
    expiryDate: string;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    supplierName?: string;
    supplierInvoice?: string;
    notes?: string;
}
