import { SupplierPaymentsService } from "./supplier-payments.service";
import { CreateSupplierPaymentDto } from "./dto/create-supplier-payment.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
export declare class SupplierPaymentsController {
    private readonly service;
    constructor(service: SupplierPaymentsService);
    create(createDto: CreateSupplierPaymentDto, req: any): Promise<import("../../schemas/supplier-payment.schema").SupplierPayment>;
    recordPayment(id: string, recordDto: RecordPaymentDto, req: any): Promise<import("../../schemas/supplier-payment.schema").SupplierPayment>;
    findAll(outletId?: string, status?: string): Promise<import("../../schemas/supplier-payment.schema").SupplierPayment[]>;
    getOverdue(outletId?: string): Promise<import("../../schemas/supplier-payment.schema").SupplierPayment[]>;
    getStats(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/supplier-payment.schema").SupplierPayment>;
}
