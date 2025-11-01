import { Model } from "mongoose";
import { SupplierPayment, SupplierPaymentDocument } from "../../schemas/supplier-payment.schema";
import { CreateSupplierPaymentDto } from "./dto/create-supplier-payment.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
export declare class SupplierPaymentsService {
    private paymentModel;
    constructor(paymentModel: Model<SupplierPaymentDocument>);
    create(createDto: CreateSupplierPaymentDto, userId: string): Promise<SupplierPayment>;
    recordPayment(id: string, recordDto: RecordPaymentDto, userId: string): Promise<SupplierPayment>;
    findAll(outletId?: string, status?: string): Promise<SupplierPayment[]>;
    findOne(id: string): Promise<SupplierPayment>;
    getOverduePayments(outletId?: string): Promise<SupplierPayment[]>;
    getPaymentStats(outletId?: string): Promise<any>;
    private generatePaymentNumber;
}
