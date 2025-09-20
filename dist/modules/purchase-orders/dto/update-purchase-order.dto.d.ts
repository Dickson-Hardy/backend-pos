import { CreatePurchaseOrderDto } from "./create-purchase-order.dto";
import { PurchaseOrderStatus } from "../../../schemas/purchase-order.schema";
declare const UpdatePurchaseOrderDto_base: import("@nestjs/common").Type<Partial<CreatePurchaseOrderDto>>;
export declare class UpdatePurchaseOrderDto extends UpdatePurchaseOrderDto_base {
    status?: PurchaseOrderStatus;
    actualDeliveryDate?: string;
    approvedBy?: string;
}
export {};
