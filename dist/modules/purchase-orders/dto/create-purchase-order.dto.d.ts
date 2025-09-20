import { PurchaseOrderPriority } from "../../../schemas/purchase-order.schema";
export declare class CreatePurchaseOrderItemDto {
    productId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    notes?: string;
}
export declare class CreatePurchaseOrderDto {
    supplierName: string;
    supplierEmail?: string;
    supplierPhone?: string;
    supplierAddress?: string;
    items: CreatePurchaseOrderItemDto[];
    subtotal: number;
    tax?: number;
    total: number;
    priority?: PurchaseOrderPriority;
    orderDate: string;
    expectedDeliveryDate?: string;
    notes?: string;
    outletId: string;
}
