import { SupplierStatus } from "../../../schemas/supplier.schema";
export declare class CreateSupplierDto {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    status?: SupplierStatus;
    rating?: number;
    paymentTerms?: string;
    website?: string;
    taxId?: string;
    bankDetails?: string;
    notes?: string;
    categories?: string[];
    outletId: string;
}
