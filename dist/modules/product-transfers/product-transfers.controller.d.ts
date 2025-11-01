import { ProductTransfersService } from "./product-transfers.service";
import { CreateTransferDto } from "./dto/create-transfer.dto";
export declare class ProductTransfersController {
    private readonly service;
    constructor(service: ProductTransfersService);
    create(createDto: CreateTransferDto, req: any): Promise<import("../../schemas/product-transfer.schema").ProductTransfer>;
    approve(id: string, req: any): Promise<import("../../schemas/product-transfer.schema").ProductTransfer>;
    complete(id: string, req: any): Promise<import("../../schemas/product-transfer.schema").ProductTransfer>;
    cancel(id: string): Promise<import("../../schemas/product-transfer.schema").ProductTransfer>;
    findAll(outletId?: string, status?: string): Promise<import("../../schemas/product-transfer.schema").ProductTransfer[]>;
    getStats(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/product-transfer.schema").ProductTransfer>;
}
