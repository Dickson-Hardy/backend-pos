import { PurchaseOrdersService } from "./purchase-orders.service";
import { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto";
import { UpdatePurchaseOrderDto } from "./dto/update-purchase-order.dto";
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(createPurchaseOrderDto: CreatePurchaseOrderDto, req: any): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    findAll(outletId?: string): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder[]>;
    getStatistics(outletId?: string): Promise<{
        total: number;
        pending: number;
        approved: number;
        inTransit: number;
        delivered: number;
        cancelled: number;
    }>;
    findOne(id: string): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    approve(id: string, req: any): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    cancel(id: string): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    markAsDelivered(id: string, body: {
        actualDeliveryDate?: string;
    }): Promise<import("../../schemas/purchase-order.schema").PurchaseOrder>;
    remove(id: string): Promise<void>;
}
