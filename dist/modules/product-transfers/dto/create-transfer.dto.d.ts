export declare class TransferItemDto {
    productId: string;
    productName: string;
    quantity: number;
    batchNumber?: string;
}
export declare class CreateTransferDto {
    fromOutletId: string;
    toOutletId: string;
    items: TransferItemDto[];
    notes?: string;
}
