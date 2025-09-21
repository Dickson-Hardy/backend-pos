import { PaymentMethod } from "../../../schemas/sale.schema";
import { CreateSalePackInfoDto } from "./sale-pack-info.dto";
export declare class SaleItemDto {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    batchNumber?: string;
    discount?: number;
    packInfo?: CreateSalePackInfoDto;
}
export declare class CreateSaleDto {
    outletId: string;
    cashierId: string;
    items: SaleItemDto[];
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
    paymentMethod: PaymentMethod;
    customerName?: string;
    customerPhone?: string;
    prescriptionNumber?: string;
    doctorName?: string;
    notes?: string;
}
