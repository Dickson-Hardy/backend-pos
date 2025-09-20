import type { Model } from "mongoose";
import { PurchaseOrder, type PurchaseOrderDocument } from "../../schemas/purchase-order.schema";
import type { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto";
import type { UpdatePurchaseOrderDto } from "./dto/update-purchase-order.dto";
export declare class PurchaseOrdersService {
    private purchaseOrderModel;
    constructor(purchaseOrderModel: Model<PurchaseOrderDocument>);
    create(createPurchaseOrderDto: CreatePurchaseOrderDto, userId: string): Promise<PurchaseOrder>;
    findAll(outletId?: string): Promise<PurchaseOrder[]>;
    findOne(id: string): Promise<PurchaseOrder>;
    update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder>;
    approve(id: string, userId: string): Promise<PurchaseOrder>;
    cancel(id: string): Promise<PurchaseOrder>;
    markAsDelivered(id: string, actualDeliveryDate?: string): Promise<PurchaseOrder>;
    remove(id: string): Promise<void>;
    private generateOrderNumber;
    getStatistics(outletId?: string): Promise<{
        total: number;
        pending: number;
        approved: number;
        inTransit: number;
        delivered: number;
        cancelled: number;
    }>;
}
